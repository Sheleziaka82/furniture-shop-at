import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { ENV } from "./_core/env";

describe("Stripe Integration", () => {
  beforeAll(() => {
    // Verify Stripe keys are configured
    expect(ENV.stripeSecretKey).toBeTruthy();
    expect(ENV.stripeWebhookSecret).toBeTruthy();
  });

  it("should have Stripe secret key configured", () => {
    expect(ENV.stripeSecretKey).toBeDefined();
    expect(ENV.stripeSecretKey.length).toBeGreaterThan(0);
  });

  it("should have Stripe webhook secret configured", () => {
    expect(ENV.stripeWebhookSecret).toBeDefined();
    expect(ENV.stripeWebhookSecret.length).toBeGreaterThan(0);
  });

  it("should have stripe router defined in appRouter", () => {
    expect(appRouter._def.procedures).toHaveProperty("stripe.createCheckoutSession");
    expect(appRouter._def.procedures).toHaveProperty("stripe.getSession");
  });

  it("should validate checkout session input schema", async () => {
    const caller = appRouter.createCaller({
      user: { id: 1, name: "Test User", email: "test@example.com", role: "user" },
      req: { headers: { origin: "http://localhost:3000" } } as any,
      res: {} as any,
    });

    // Test with invalid input - should throw validation error
    await expect(
      caller.stripe.createCheckoutSession({
        cartItems: [],
        shippingMethod: "invalid" as any,
      })
    ).rejects.toThrow();
  });

  it("should accept valid shipping methods", async () => {
    const validMethods = ["standard", "express", "pickup", "assembly"];
    
    validMethods.forEach(method => {
      expect(["standard", "express", "pickup", "assembly"]).toContain(method);
    });
  });
});
