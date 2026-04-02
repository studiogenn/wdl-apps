import { describe, it, expect } from "vitest";
import { STRIPE_IDS, resolveTier } from "./stripe-config";

describe("stripe-config", () => {
  it("has tier price IDs for all subscription tiers", () => {
    for (const tier of ["biweekly-2", "weekly-1", "weekly-2"] as const) {
      expect(STRIPE_IDS.subscription.tiers[tier].priceId).toMatch(/^price_/);
    }
  });

  it("has correct monthly cents", () => {
    expect(STRIPE_IDS.subscription.tiers["biweekly-2"].monthlyCents).toBe(13996);
    expect(STRIPE_IDS.subscription.tiers["weekly-1"].monthlyCents).toBe(13196);
    expect(STRIPE_IDS.subscription.tiers["weekly-2"].monthlyCents).toBe(24792);
  });

  it("has overage price ID", () => {
    expect(STRIPE_IDS.subscription.overagePriceId).toMatch(/^price_/);
  });

  it("has meter config", () => {
    expect(STRIPE_IDS.subscription.meterId).toMatch(/^mtr_/);
    expect(STRIPE_IDS.subscription.meterEventName).toBe("wdl_overage_lbs");
  });

  it("has single order product ID", () => {
    expect(STRIPE_IDS.singleOrder.productId).toMatch(/^prod_/);
  });
});

describe("resolveTier", () => {
  it("biweekly always returns biweekly-2", () => {
    expect(resolveTier("biweekly", 1)).toBe("biweekly-2");
    expect(resolveTier("biweekly", 2)).toBe("biweekly-2");
    expect(resolveTier("biweekly", 3)).toBe("biweekly-2");
  });

  it("weekly 1 bag returns weekly-1", () => {
    expect(resolveTier("weekly", 1)).toBe("weekly-1");
  });

  it("weekly 2+ bags returns weekly-2", () => {
    expect(resolveTier("weekly", 2)).toBe("weekly-2");
    expect(resolveTier("weekly", 3)).toBe("weekly-2");
    expect(resolveTier("weekly", 4)).toBe("weekly-2");
  });
});
