import { describe, it, expect } from "vitest";
import { STRIPE_IDS } from "./stripe-config";

describe("stripe-config", () => {
  it("has subscription price IDs", () => {
    expect(STRIPE_IDS.subscription.basePriceId).toMatch(/^price_/);
    expect(STRIPE_IDS.subscription.overagePriceId).toMatch(/^price_/);
  });

  it("has subscription product ID", () => {
    expect(STRIPE_IDS.subscription.productId).toMatch(/^prod_/);
  });

  it("has meter config", () => {
    expect(STRIPE_IDS.subscription.meterId).toMatch(/^mtr_/);
    expect(STRIPE_IDS.subscription.meterEventName).toBe("wdl_overage_lbs");
  });

  it("has single order product ID", () => {
    expect(STRIPE_IDS.singleOrder.productId).toMatch(/^prod_/);
  });
});
