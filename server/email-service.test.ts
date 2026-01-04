import { describe, it, expect } from "vitest";
import { generateOrderConfirmationEmail } from "./email-service";

describe("Email Service", () => {
  it("should generate German order confirmation email", () => {
    const html = generateOrderConfirmationEmail({
      orderNumber: "ORD-TEST-123",
      customerName: "Max Mustermann",
      customerEmail: "max@example.com",
      items: [
        {
          productName: "Eiche Esstisch",
          price: 89900,
          quantity: 1,
          variantColor: "Natur",
        },
        {
          productName: "Stuhl Set (4 Stück)",
          price: 39900,
          quantity: 1,
        },
      ],
      subtotal: 129800,
      shippingCost: 990,
      total: 130790,
      shippingMethod: "standard",
      shippingAddress: "Max Mustermann\nMusterstraße 123\n1010 Wien\nÖsterreich",
      language: "de",
    });

    expect(html).toContain("Bestellbestätigung");
    expect(html).toContain("ORD-TEST-123");
    expect(html).toContain("Max Mustermann");
    expect(html).toContain("Eiche Esstisch");
    expect(html).toContain("€899.00");
    expect(html).toContain("Vielen Dank");
    expect(html).toContain("Möbelhaus");
  });

  it("should generate English order confirmation email", () => {
    const html = generateOrderConfirmationEmail({
      orderNumber: "ORD-TEST-456",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      items: [
        {
          productName: "Oak Dining Table",
          price: 89900,
          quantity: 1,
        },
      ],
      subtotal: 89900,
      shippingCost: 1990,
      total: 91890,
      shippingMethod: "express",
      shippingAddress: "John Doe\n123 Main St\n1010 Vienna\nAustria",
      language: "en",
    });

    expect(html).toContain("Order Confirmation");
    expect(html).toContain("ORD-TEST-456");
    expect(html).toContain("John Doe");
    expect(html).toContain("Oak Dining Table");
    expect(html).toContain("€899.00");
    expect(html).toContain("Thank you");
    expect(html).toContain("Express Shipping");
  });

  it("should include all order items in email", () => {
    const html = generateOrderConfirmationEmail({
      orderNumber: "ORD-TEST-789",
      customerName: "Test User",
      customerEmail: "test@example.com",
      items: [
        { productName: "Item 1", price: 10000, quantity: 2 },
        { productName: "Item 2", price: 20000, quantity: 1 },
        { productName: "Item 3", price: 15000, quantity: 3 },
      ],
      subtotal: 85000,
      shippingCost: 990,
      total: 85990,
      shippingMethod: "standard",
      shippingAddress: "Test Address",
      language: "de",
    });

    expect(html).toContain("Item 1");
    expect(html).toContain("Item 2");
    expect(html).toContain("Item 3");
    expect(html).toContain("€100.00");
    expect(html).toContain("€200.00");
    expect(html).toContain("€150.00");
  });

  it("should format prices correctly", () => {
    const html = generateOrderConfirmationEmail({
      orderNumber: "ORD-TEST-999",
      customerName: "Price Test",
      customerEmail: "price@example.com",
      items: [
        { productName: "Test Product", price: 12345, quantity: 1 },
      ],
      subtotal: 12345,
      shippingCost: 990,
      total: 13335,
      shippingMethod: "standard",
      shippingAddress: "Test",
      language: "de",
    });

    expect(html).toContain("€123.45");
    expect(html).toContain("€9.90");
    expect(html).toContain("€133.35");
  });

  it("should include shipping method information", () => {
    const methods = [
      { method: "standard", expected: "Standard Versand" },
      { method: "express", expected: "Express Versand" },
      { method: "pickup", expected: "Selbstabholung" },
      { method: "assembly", expected: "Lieferung mit Montage" },
    ];

    methods.forEach(({ method, expected }) => {
      const html = generateOrderConfirmationEmail({
        orderNumber: "ORD-TEST",
        customerName: "Test",
        customerEmail: "test@example.com",
        items: [{ productName: "Test", price: 10000, quantity: 1 }],
        subtotal: 10000,
        shippingCost: 0,
        total: 10000,
        shippingMethod: method,
        shippingAddress: "Test",
        language: "de",
      });

      expect(html).toContain(expected);
    });
  });
});
