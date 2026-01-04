import { describe, it, expect } from "vitest";
import { generateShippingNotificationEmail, generateTrackingUrl } from "./email-service";

describe("Shipping Notification System", () => {
  describe("generateTrackingUrl", () => {
    it("should generate correct DHL tracking URL", () => {
      const url = generateTrackingUrl("DHL", "123456789");
      expect(url).toContain("dhl.at");
      expect(url).toContain("123456789");
    });

    it("should generate correct DPD tracking URL", () => {
      const url = generateTrackingUrl("DPD", "987654321");
      expect(url).toContain("tracking.dpd.de");
      expect(url).toContain("987654321");
    });

    it("should generate correct Austrian Post tracking URL", () => {
      const url = generateTrackingUrl("Austrian Post", "ABC123XYZ");
      expect(url).toContain("post.at");
      expect(url).toContain("ABC123XYZ");
    });

    it("should generate correct GLS tracking URL", () => {
      const url = generateTrackingUrl("GLS", "GLS123456");
      expect(url).toContain("gls-group.eu");
      expect(url).toContain("GLS123456");
    });

    it("should fallback to Google search for unknown carriers", () => {
      const url = generateTrackingUrl("Unknown Carrier", "TRACK123");
      expect(url).toContain("google.com/search");
      expect(url).toContain("TRACK123");
    });
  });

  describe("generateShippingNotificationEmail", () => {
    it("should generate German shipping notification email", () => {
      const html = generateShippingNotificationEmail({
        orderNumber: "ORD-TEST-123",
        customerName: "Max Mustermann",
        customerEmail: "max@example.com",
        trackingNumber: "DHL123456789",
        carrier: "DHL",
        estimatedDelivery: "15.01.2026",
        shippingMethod: "express",
        language: "de",
      });

      expect(html).toContain("Versandbestätigung");
      expect(html).toContain("ORD-TEST-123");
      expect(html).toContain("Max Mustermann");
      expect(html).toContain("DHL123456789");
      expect(html).toContain("DHL");
      expect(html).toContain("15.01.2026");
      expect(html).toContain("Gute Nachrichten");
      expect(html).toContain("Sendung verfolgen");
    });

    it("should generate English shipping notification email", () => {
      const html = generateShippingNotificationEmail({
        orderNumber: "ORD-TEST-456",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        trackingNumber: "DPD987654321",
        carrier: "DPD",
        shippingMethod: "standard",
        language: "en",
      });

      expect(html).toContain("Shipping Confirmation");
      expect(html).toContain("ORD-TEST-456");
      expect(html).toContain("John Doe");
      expect(html).toContain("DPD987654321");
      expect(html).toContain("DPD");
      expect(html).toContain("Good news");
      expect(html).toContain("Track Shipment");
    });

    it("should include tracking URL in email", () => {
      const html = generateShippingNotificationEmail({
        orderNumber: "ORD-TEST-789",
        customerName: "Test User",
        customerEmail: "test@example.com",
        trackingNumber: "POST123ABC",
        carrier: "Austrian Post",
        shippingMethod: "standard",
        language: "de",
      });

      expect(html).toContain("post.at");
      expect(html).toContain("POST123ABC");
      expect(html).toContain('href="https://www.post.at');
    });

    it("should include estimated delivery if provided", () => {
      const html = generateShippingNotificationEmail({
        orderNumber: "ORD-TEST-999",
        customerName: "Test User",
        customerEmail: "test@example.com",
        trackingNumber: "TRACK123",
        carrier: "DHL",
        estimatedDelivery: "20.01.2026",
        shippingMethod: "express",
        language: "de",
      });

      expect(html).toContain("20.01.2026");
      expect(html).toContain("Voraussichtliche Lieferung");
    });

    it("should not show estimated delivery section if not provided", () => {
      const html = generateShippingNotificationEmail({
        orderNumber: "ORD-TEST-888",
        customerName: "Test User",
        customerEmail: "test@example.com",
        trackingNumber: "TRACK456",
        carrier: "DHL",
        shippingMethod: "standard",
        language: "de",
      });

      // Should not contain the estimated delivery label if no date provided
      const hasEstimatedDeliverySection = html.includes("Voraussichtliche Lieferung:");
      expect(hasEstimatedDeliverySection).toBe(false);
    });

    it("should translate shipping methods correctly", () => {
      const methods = [
        { method: "standard", lang: "de" as const, expected: "Standard Versand" },
        { method: "express", lang: "de" as const, expected: "Express Versand" },
        { method: "pickup", lang: "de" as const, expected: "Selbstabholung" },
        { method: "assembly", lang: "de" as const, expected: "Lieferung mit Montage" },
        { method: "standard", lang: "en" as const, expected: "Standard Shipping" },
        { method: "express", lang: "en" as const, expected: "Express Shipping" },
      ];

      methods.forEach(({ method, lang, expected }) => {
        const html = generateShippingNotificationEmail({
          orderNumber: "ORD-TEST",
          customerName: "Test",
          customerEmail: "test@example.com",
          trackingNumber: "TRACK",
          carrier: "DHL",
          shippingMethod: method,
          language: lang,
        });

        expect(html).toContain(expected);
      });
    });

    it("should include delivery tips", () => {
      const html = generateShippingNotificationEmail({
        orderNumber: "ORD-TEST-777",
        customerName: "Test User",
        customerEmail: "test@example.com",
        trackingNumber: "TRACK789",
        carrier: "DHL",
        shippingMethod: "standard",
        language: "de",
      });

      expect(html).toContain("Informationen zur Zustellung");
      expect(html).toContain("jemand zu Hause ist");
      expect(html).toContain("Benachrichtigung hinterlassen");
      expect(html).toContain("Bordsteinkante");
    });
  });
});
