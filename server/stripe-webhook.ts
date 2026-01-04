import { Request, Response } from "express";
import Stripe from "stripe";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { orders, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendOrderConfirmationEmail } from "./email-service";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
});

/**
 * Stripe webhook handler
 * This endpoint receives events from Stripe when payments are completed
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    console.error("[Webhook] Missing stripe-signature header");
    return res.status(400).send('Missing signature');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error(`[Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ 
      verified: true,
    });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log(`[Webhook] Checkout session completed: ${session.id}`);
      console.log(`[Webhook] Payment status: ${session.payment_status}`);
      console.log(`[Webhook] Metadata:`, session.metadata);

      if (session.payment_status === 'paid') {
        // Extract metadata
        const userId = session.metadata?.user_id;
        const customerEmail = session.metadata?.customer_email || session.customer_email;
        const customerName = session.metadata?.customer_name;
        const shippingMethod = session.metadata?.shipping_method;
        const promoCode = session.metadata?.promo_code;
        const discountAmount = parseInt(session.metadata?.discount_amount || '0');

        if (!userId) {
          console.error("[Webhook] Missing user_id in metadata");
          return res.status(400).send('Missing user_id');
        }

        // Update user's Stripe customer ID if available
        const db = await getDb();
        if (!db) {
          console.error("[Webhook] Database not available");
          return res.status(500).send('Database error');
        }
        if (session.customer) {
          try {
            await db.update(users)
              .set({ stripeCustomerId: session.customer as string })
              .where(eq(users.id, parseInt(userId)));
            console.log(`[Webhook] Updated user ${userId} with Stripe customer ID`);
          } catch (error) {
            console.error("[Webhook] Error updating user:", error);
          }
        }

        // Create order in database
        if (!db) {
          console.error("[Webhook] Database not available");
          return res.status(500).send('Database error');
        }
        try {
          const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          await db.insert(orders).values({
            userId: parseInt(userId),
            orderNumber,
            status: 'processing',
            totalAmount: session.amount_total || 0,
            shippingCost: 0, // Will be calculated from line items
            discountAmount,
            promoCode: promoCode || null,
            shippingMethod: shippingMethod || 'standard',
            paymentMethod: 'card',
            paymentStatus: 'completed',
            customerEmail: customerEmail || '',
            customerPhone: null,
            shippingAddress: JSON.stringify((session as any).shipping_details || {}),
            billingAddress: JSON.stringify(session.customer_details || {}),
            stripePaymentIntentId: session.payment_intent as string || null,
            stripeCheckoutSessionId: session.id,
          });

          console.log(`[Webhook] Created order ${orderNumber} for user ${userId}`);

          // Send order confirmation email
          try {
            // Retrieve line items from session
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
              expand: ['data.price.product'],
            });

            const items = lineItems.data.map(item => ({
              productName: (item.description || 'Product'),
              price: item.amount_total,
              quantity: item.quantity || 1,
            }));

            // Calculate shipping cost (last item if it's shipping)
            let shippingCost = 0;
            const lastItem = items[items.length - 1];
            if (lastItem && (lastItem.productName.includes('Versand') || lastItem.productName.includes('Shipping') || lastItem.productName.includes('Lieferung'))) {
              shippingCost = lastItem.price;
              items.pop(); // Remove shipping from items list
            }

            const subtotal = items.reduce((sum, item) => sum + item.price, 0);

            // Determine language from metadata or default to German
            const language = session.metadata?.language === 'en' ? 'en' : 'de';

            // Format shipping address
            const shippingDetails = (session as any).shipping_details;
            let shippingAddress = '';
            if (shippingDetails && shippingDetails.address) {
              const addr = shippingDetails.address;
              shippingAddress = `${shippingDetails.name || customerName || ''}
${addr.line1 || ''}
${addr.line2 || ''}
${addr.postal_code || ''} ${addr.city || ''}
${addr.country || ''}`;
            } else {
              shippingAddress = customerName || '';
            }

            await sendOrderConfirmationEmail({
              orderNumber,
              customerName: customerName || 'Kunde',
              customerEmail: customerEmail || '',
              items,
              subtotal,
              shippingCost,
              total: session.amount_total || 0,
              shippingMethod: shippingMethod || 'standard',
              shippingAddress: shippingAddress.trim(),
              language,
            });

            console.log(`[Webhook] Order confirmation email sent to ${customerEmail}`);
          } catch (emailError) {
            console.error("[Webhook] Error sending order confirmation email:", emailError);
            // Don't fail the webhook if email fails
          }
        } catch (error) {
          console.error("[Webhook] Error creating order:", error);
          return res.status(500).send('Error creating order');
        }
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Webhook] Payment intent succeeded: ${paymentIntent.id}`);
      
      // Update order payment status if needed
      const db = await getDb();
      if (!db) break;
      try {
        await db.update(orders)
          .set({ paymentStatus: 'completed' })
          .where(eq(orders.stripePaymentIntentId, paymentIntent.id));
      } catch (error) {
        console.error("[Webhook] Error updating order:", error);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Webhook] Payment intent failed: ${paymentIntent.id}`);
      
      // Update order payment status
      const db = await getDb();
      if (!db) break;
      try {
        await db.update(orders)
          .set({ paymentStatus: 'failed' })
          .where(eq(orders.stripePaymentIntentId, paymentIntent.id));
      } catch (error) {
        console.error("[Webhook] Error updating order:", error);
      }
      break;
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
}
