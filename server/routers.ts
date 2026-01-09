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
  getMainCategories,
  getSubcategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
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
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "./db";
import { orders } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendShippingNotificationEmail } from "./email-service";

export const appRouter = router({
  system: systemRouter,
  
  // Categories routes
  categories: router({
    getAll: publicProcedure.query(async () => {
      return getCategories();
    }),
    getMain: publicProcedure.query(async () => {
      return getMainCategories();
    }),
    getSubcategories: publicProcedure
      .input(z.object({ parentId: z.number() }))
      .query(async ({ input }) => {
        return getSubcategories(input.parentId);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getCategoryById(input.id);
      }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getCategoryBySlug(input.slug);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        parentId: z.number().nullable().optional(),
        imageUrl: z.string().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Only admins can create categories');
        }
        return createCategory(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        parentId: z.number().nullable().optional(),
        imageUrl: z.string().optional(),
        displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Only admins can update categories');
        }
        const { id, ...data } = input;
        await updateCategory(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Only admins can delete categories');
        }
        await deleteCategory(input.id);
        return { success: true };
      }),
  }),
  
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
    
    // Admin: Create product
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string(),
        category: z.string(), // Now accepts categoryId as string
        price: z.number().positive(),
        discount: z.number().min(0).max(100).optional(),
        material: z.string().optional(),
        color: z.string().optional(),
        width: z.number().min(0).optional(),
        height: z.number().min(0).optional(),
        depth: z.number().min(0).optional(),
        weight: z.number().min(0).optional(),
        stock: z.number().min(0).optional(),
        images: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Check if user is admin
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }

        // Parse categoryId from string
        const categoryId = parseInt(input.category, 10);
        if (isNaN(categoryId)) {
          throw new Error('Invalid category ID');
        }

        // Convert price to cents
        const priceInCents = Math.round(input.price * 100);

        // Format weight as string with unit
        const weightStr = input.weight ? `${input.weight}kg` : undefined;

        const productId = await createProduct({
          name: input.name,
          description: input.description,
          categoryId,
          price: priceInCents,
          discount: input.discount,
          material: input.material,
          color: input.color,
          width: input.width,
          height: input.height,
          depth: input.depth,
          weight: weightStr,
          stock: input.stock,
          images: input.images,
        });

        return { success: true, productId };
      }),
    
    // Admin: Get all products
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }
        return getAllProducts();
      }),
    
    // Admin: Update product
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        categoryId: z.number().optional(),
        price: z.number().optional(),
        discount: z.number().optional(),
        material: z.string().optional(),
        color: z.string().optional(),
        dimensions: z.string().optional(),
        weight: z.string().optional(),
        stock: z.number().optional(),
        isBestseller: z.number().optional(),
        isNew: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }
        const { id, ...data } = input;
        await updateProduct(id, data);
        return { success: true };
      }),
    
    // Admin: Delete product
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }
        await deleteProduct(input.id);
        return { success: true };
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
