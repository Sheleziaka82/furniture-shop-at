/**
 * Stripe Products Configuration
 * 
 * This file defines the mapping between our furniture products and Stripe.
 * For this furniture e-commerce platform, we use dynamic pricing based on cart contents.
 */

export interface StripeLineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
      images?: string[];
    };
    unit_amount: number; // in cents
  };
  quantity: number;
}

/**
 * Convert cart items to Stripe line items
 */
export function createStripeLineItems(cartItems: Array<{
  productName: string;
  productDescription?: string;
  productImage?: string;
  price: number; // in cents
  quantity: number;
}>): StripeLineItem[] {
  return cartItems.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.productName,
        description: item.productDescription,
        images: item.productImage ? [item.productImage] : [],
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));
}

/**
 * Shipping rates for Austria
 */
export const SHIPPING_RATES = {
  standard: {
    name: 'Standard Versand (3-5 Werktage)',
    amount: 990, // €9.90 in cents
  },
  express: {
    name: 'Express Versand (1-2 Werktage)',
    amount: 1990, // €19.90 in cents
  },
  pickup: {
    name: 'Selbstabholung',
    amount: 0,
  },
  assembly: {
    name: 'Lieferung mit Montage',
    amount: 4990, // €49.90 in cents
  },
};

/**
 * Create shipping line item
 */
export function createShippingLineItem(shippingMethod: keyof typeof SHIPPING_RATES): StripeLineItem | null {
  const shipping = SHIPPING_RATES[shippingMethod];
  if (!shipping || shipping.amount === 0) return null;

  return {
    price_data: {
      currency: 'eur',
      product_data: {
        name: shipping.name,
      },
      unit_amount: shipping.amount,
    },
    quantity: 1,
  };
}
