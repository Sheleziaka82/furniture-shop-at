import { eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  products,
  productImages,
  productVariants,
  cartItems,
  orders,
  orderItems,
  wishlistItems,
  userAddresses,
  reviews,
  loyaltyPoints,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

// Category queries
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.displayOrder);
}

export async function getMainCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories)
    .where(isNull(categories.parentId))
    .orderBy(categories.displayOrder);
}

export async function getSubcategories(parentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories)
    .where(eq(categories.parentId, parentId))
    .orderBy(categories.displayOrder);
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  parentId?: number | null;
  imageUrl?: string;
  displayOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [result] = await db.insert(categories).values({
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    parentId: data.parentId || null,
    imageUrl: data.imageUrl || null,
    displayOrder: data.displayOrder || 0,
    isActive: true,
  });
  
  return Number((result as any).insertId);
}

export async function updateCategory(id: number, data: Partial<{
  name: string;
  slug: string;
  description: string;
  parentId: number | null;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Check if category has subcategories
  const subcats = await getSubcategories(id);
  if (subcats.length > 0) {
    throw new Error('Cannot delete category with subcategories');
  }
  
  // Check if category has products
  const productsInCategory = await db.select().from(products).where(eq(products.categoryId, id)).limit(1);
  if (productsInCategory.length > 0) {
    throw new Error('Cannot delete category with products');
  }
  
  await db.delete(categories).where(eq(categories.id, id));
}

// Product queries

export async function createProduct(data: {
  name: string;
  description: string;
  categoryId: number;
  price: number;
  discount?: number;
  material?: string;
  color?: string;
  width?: number;
  height?: number;
  depth?: number;
  weight?: string;
  stock?: number;
  images?: string[];
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Generate slug from name
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Date.now();

  // Format dimensions
  const dimensions = data.width && data.height && data.depth 
    ? `${data.width}x${data.height}x${data.depth}cm`
    : null;

  // Insert product
  const [result] = await db.insert(products).values({
    name: data.name,
    slug,
    description: data.description || null,
    categoryId: data.categoryId,
    price: data.price,
    discount: data.discount || 0,
    material: data.material || null,
    color: data.color || null,
    dimensions,
    weight: data.weight || null,
    stock: data.stock || 0,
  });

  const productId = Number((result as any).insertId);

  // Insert images if provided
  if (data.images && data.images.length > 0) {
    await Promise.all(
      data.images.map((imageUrl, index) =>
        db.insert(productImages).values({
          productId,
          imageUrl,
          altText: data.name,
          displayOrder: index,
        })
      )
    );
  }

  return productId;
}

export async function updateProduct(id: number, data: Partial<{
  name: string;
  description: string;
  categoryId: number;
  price: number;
  discount: number;
  material: string;
  color: string;
  dimensions: string;
  weight: string;
  stock: number;
  isBestseller: number;
  isNew: number;
}>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Delete product images first
  await db.delete(productImages).where(eq(productImages.productId, id));
  
  // Delete product
  await db.delete(products).where(eq(products.id, id));
}

export async function getAllProducts(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return { products: [], total: 0 };
  
  const result = await db
    .select()
    .from(products)
    .limit(limit)
    .offset(offset);
  
  return { products: result, total: result.length };
}

export async function getProductsByCategory(categoryId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return { products: [], total: 0 };
  const result = await db
    .select()
    .from(products)
    .where(eq(products.categoryId, categoryId))
    .limit(limit)
    .offset(offset);
  return { products: result, total: result.length };
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return result[0];
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result[0];
}

export async function getProductImages(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(productImages.displayOrder);
}

export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId));
}

// Cart queries
export async function getUserCart(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(userId: number, productId: number, variantId: number | undefined, quantity: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(cartItems).values({
    userId,
    productId,
    variantId,
    quantity,
  });
  return result;
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  return true;
}

// Order queries
export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(orders.createdAt);
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(orders.createdAt);
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result[0];
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// Wishlist queries
export async function getUserWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId));
}

// Address queries
export async function getUserAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userAddresses).where(eq(userAddresses.userId, userId));
}

// Review queries
export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(eq(reviews.productId, productId));
}

// Loyalty points
export async function getUserLoyaltyPoints(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, userId)).limit(1);
  return result[0];
}
