import { describe, it, expect } from "vitest";
import { STRIPE_PRICES, STRIPE_METER_EVENT_NAME } from "./stripe-plans";

describe("stripe-plans", () => {
  it("has subscription base price ID", () => {
    expect(STRIPE_PRICES.subscriptionBase).toMatch(/^price_/);
  });

  it("has overage price ID", () => {
    expect(STRIPE_PRICES.overagePerLb).toMatch(/^price_/);
  });

  it("has meter event name", () => {
    expect(STRIPE_METER_EVENT_NAME).toBe("wdl_overage_lbs");
  });
});
