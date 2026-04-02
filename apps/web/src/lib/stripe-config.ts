const isLive = (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_live_");

/**
 * Subscription tiers keyed by "frequency-bags".
 * Each tier has a per-bag Stripe price; quantity on checkout = bags × pickups/month.
 *
 *   biweekly-2 → $34.99/bag × 4 bags/mo = $139.96/mo
 *   weekly-1   → $32.99/bag × 4 bags/mo = $131.96/mo
 *   weekly-2   → $30.99/bag × 8 bags/mo = $247.92/mo
 */
export type SubscriptionTier = "biweekly-2" | "weekly-1" | "weekly-2";

export interface TierPrice {
  readonly priceId: string;
  readonly perBagCents: number;
}

export const STRIPE_IDS = isLive
  ? {
      subscription: {
        productId: "prod_UG9hAT6phE29C0",
        tiers: {
          "biweekly-2": { priceId: "TODO_LIVE_BIWEEKLY_2", perBagCents: 3499 },
          "weekly-1": { priceId: "TODO_LIVE_WEEKLY_1", perBagCents: 3299 },
          "weekly-2": { priceId: "TODO_LIVE_WEEKLY_2", perBagCents: 3099 },
        } satisfies Record<SubscriptionTier, TierPrice>,
        overagePriceId: "price_1THdOE3uBUfrZCbdpf1mDo1i",
        meterId: "mtr_61UR1LQR1lQaIaDuW413uBUfrZCbd0ds",
        meterEventName: "wdl_overage_lbs",
      },
      singleOrder: {
        productId: "prod_UG9h7B9gmI593L",
      },
    }
  : {
      subscription: {
        productId: "prod_UG0lAckijhXdgv",
        tiers: {
          "biweekly-2": { priceId: "price_1THs5x3uBUfrZCbdPBs2zPyD", perBagCents: 3499 },
          "weekly-1": { priceId: "price_1THs5x3uBUfrZCbdNxSAvHBp", perBagCents: 3299 },
          "weekly-2": { priceId: "price_1THs5y3uBUfrZCbd1mkfvrxP", perBagCents: 3099 },
        } satisfies Record<SubscriptionTier, TierPrice>,
        overagePriceId: "price_1THUjU3uBUfrZCbddHw0rOhH",
        meterId: "mtr_test_61UQsgqnQW0C1ccZ8413uBUfrZCbdXyS",
        meterEventName: "wdl_overage_lbs",
      },
      singleOrder: {
        productId: "prod_UG0lZlCA5LXvNI",
      },
    };

export function resolveTier(
  frequency: "weekly" | "biweekly",
  bags: number,
): SubscriptionTier {
  if (frequency === "biweekly") return "biweekly-2";
  return bags >= 2 ? "weekly-2" : "weekly-1";
}
