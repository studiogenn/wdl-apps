const isLive = (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_live_");

/**
 * Subscription tiers keyed by "frequency-bags".
 * Each tier is a flat monthly membership with a bag allocation.
 *
 *   biweekly-2 → $139.96/mo (2 bags × 2 pickups/mo)
 *   weekly-1   → $131.96/mo (1 bag  × 4 pickups/mo)
 *   weekly-2   → $247.92/mo (2 bags × 4 pickups/mo)
 */
export type SubscriptionTier = "biweekly-2" | "weekly-1" | "weekly-2";

export interface TierPrice {
  readonly priceId: string;
  readonly monthlyCents: number;
}

export const STRIPE_IDS = isLive
  ? {
      subscription: {
        productId: "prod_UG9hAT6phE29C0",
        tiers: {
          "biweekly-2": { priceId: "price_1THsTM3uBUfrZCbdcOwFYq6R", monthlyCents: 13996 },
          "weekly-1": { priceId: "price_1THsTM3uBUfrZCbd0uoBtSMy", monthlyCents: 13196 },
          "weekly-2": { priceId: "price_1THsTM3uBUfrZCbd4PgH7Sa7", monthlyCents: 24792 },
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
          "biweekly-2": { priceId: "price_1THsT63uBUfrZCbd5n4GCD9Z", monthlyCents: 13996 },
          "weekly-1": { priceId: "price_1THsT63uBUfrZCbd0TgV3sif", monthlyCents: 13196 },
          "weekly-2": { priceId: "price_1THsT63uBUfrZCbdWhNrEJDr", monthlyCents: 24792 },
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
