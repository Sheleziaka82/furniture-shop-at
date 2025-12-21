import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
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
  getOrderById,
  getOrderItems,
} from "./db";

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
  }),
});

export type AppRouter = typeof appRouter;
