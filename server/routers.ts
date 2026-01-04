import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { ENV } from "./_core/env";
import { createStripeLineItems, createShippingLineItem } from "./stripe-products";
import {
  getCategories,
  getProductsByCategory,
  getProductBySlug,
  getProductById,
  getProductImages,
  getProductVariants,
  getProductReviews,
  getUserWishlist,
  addToCart,
  removeFromCart,
  getUserCart,
  getUserAddresses,
  getUserOrders,
  getAllOrders,
  getOrderById,
  getOrderItems,
  getDb,
} from "./db";
import { orders } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendShippingNotificationEmail } from "./email-service";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Product routes
  products: router({
    getCategories: publicProcedure.query(async () => {
      return getCategories();
    }),
    getByCategory: publicProcedure
      .input(z.object({
        categoryId: z.number(),
        limit: z.number().optional().default(20),
        offset: z.number().optional().default(0),
      }))
      .query(async ({ input }) => {
        return getProductsByCategory(input.categoryId, input.limit, input.offset);
      }),
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const product = await getProductBySlug(input);
        if (!product) return null;
        const images = await getProductImages(product.id);
        const variants = await getProductVariants(product.id);
        const reviews = await getProductReviews(product.id);
        return { ...product, images, variants, reviews };
      }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const product = await getProductById(input);
        if (!product) return null;
        const images = await getProductImages(product.id);
        const variants = await getProductVariants(product.id);
        const reviews = await getProductReviews(product.id);
        return { ...product, images, variants, reviews };
      }),
  }),

  // Cart routes
  cart: router({
    getCart: protectedProcedure.query(async ({ ctx }) => {
      return getUserCart(ctx.user.id);
    }),
    addItem: protectedProcedure
      .input(z.object({
        productId: z.number(),
        variantId: z.number().optional(),
        quantity: z.number().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const product = await getProductById(input.productId);
        if (!product) throw new Error("Product not found");
        
        return addToCart(
          ctx.user.id,
          input.productId,
          input.variantId,
          input.quantity
        );
      }),
    removeItem: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return removeFromCart(input);
      }),
  }),

  // Wishlist routes
  wishlist: router({
    getWishlist: protectedProcedure.query(async ({ ctx }) => {
      return getUserWishlist(ctx.user.id);
    }),
  }),

  // Address routes
  addresses: router({
    getAddresses: protectedProcedure.query(async ({ ctx }) => {
      return getUserAddresses(ctx.user.id);
    }),
  }),

  // Order routes
  orders: router({
    getOrders: protectedProcedure.query(async ({ ctx }) => {
      return getUserOrders(ctx.user.id);
    }),
    
    // Admin: Get all orders
    getAllOrders: protectedProcedure.query(async ({ ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }
      return getAllOrders();
    }),
    getOrder: protectedProcedure
      .input(z.number())
      .query(async ({ input, ctx }) => {
        const order = await getOrderById(input);
        if (!order || order.userId !== ctx.user.id) {
          throw new Error("Order not found");
        }
        const items = await getOrderItems(input);
        return { ...order, items };
      }),
    
    // Admin: Mark order as shipped and send notification
    markAsShipped: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        trackingNumber: z.string().min(1),
        carrier: z.enum(['DHL', 'DPD', 'Austrian Post', 'Post', 'GLS', 'Other']),
        estimatedDelivery: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Check if user is admin
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }

        const db = await getDb();
        if (!db) {
          throw new Error('Database not available');
        }

        // Get order details
        const order = await getOrderById(input.orderId);
        if (!order) {
          throw new Error('Order not found');
        }

        // Update order status and tracking info
        await db.update(orders)
          .set({
            status: 'shipped',
            trackingNumber: input.trackingNumber,
            carrier: input.carrier,
            estimatedDelivery: input.estimatedDelivery || null,
          })
          .where(eq(orders.id, input.orderId));

        // Parse shipping address to get customer name
        let customerName = 'Kunde';
        try {
          const shippingDetails = JSON.parse(order.shippingAddress);
          if (shippingDetails.name) {
            customerName = shippingDetails.name;
          } else if (shippingDetails.address && shippingDetails.address.line1) {
            // Try to extract name from address
            customerName = shippingDetails.address.line1.split('\n')[0] || 'Kunde';
          }
        } catch (e) {
          // If parsing fails, try to extract first line as name
          const lines = order.shippingAddress.split('\n');
          if (lines.length > 0) {
            customerName = lines[0];
          }
        }

        // Send shipping notification email
        try {
          await sendShippingNotificationEmail({
            orderNumber: order.orderNumber,
            customerName,
            customerEmail: order.customerEmail,
            trackingNumber: input.trackingNumber,
            carrier: input.carrier,
            estimatedDelivery: input.estimatedDelivery,
            shippingMethod: order.shippingMethod || 'standard',
            language: 'de', // Default to German, can be enhanced to detect from order metadata
          });

          console.log(`[Orders] Shipping notification sent for order ${order.orderNumber}`);
        } catch (emailError) {
          console.error('[Orders] Failed to send shipping notification:', emailError);
          // Don't fail the mutation if email fails
        }

        return {
          success: true,
          message: 'Order marked as shipped and notification sent',
        };
      }),
  }),

  // Stripe payment routes
  stripe: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({
        cartItems: z.array(z.object({
          productName: z.string(),
          productDescription: z.string().optional(),
          productImage: z.string().optional(),
          price: z.number(), // in cents
          quantity: z.number(),
        })),
        shippingMethod: z.enum(['standard', 'express', 'pickup', 'assembly']),
        promoCode: z.string().optional(),
        discountAmount: z.number().optional().default(0),
      }))
      .mutation(async ({ input, ctx }) => {
        const stripe = new Stripe(ENV.stripeSecretKey, {
          apiVersion: '2025-12-15.clover',
        });

        // Create line items from cart
        const lineItems = createStripeLineItems(input.cartItems);

        // Add shipping if applicable
        const shippingLineItem = createShippingLineItem(input.shippingMethod);
        if (shippingLineItem) {
          lineItems.push(shippingLineItem);
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || '',
            customer_name: ctx.user.name || '',
            shipping_method: input.shippingMethod,
            promo_code: input.promoCode || '',
            discount_amount: input.discountAmount.toString(),
          },
          success_url: `${ctx.req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/checkout`,
          allow_promotion_codes: true,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      }),

    getSession: protectedProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const stripe = new Stripe(ENV.stripeSecretKey, {
          apiVersion: '2025-12-15.clover',
        });

        const session = await stripe.checkout.sessions.retrieve(input);
        return session;
      }),
  }),
});

export type AppRouter = typeof appRouter;
