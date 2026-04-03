const isLive = (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_live_");

// ── Legacy bag-based tiers (kept for existing subscribers) ──

export type LegacySubscriptionTier = "biweekly-2" | "weekly-1" | "weekly-2";

export interface LegacyTierPrice {
  readonly priceId: string;
  readonly monthlyCents: number;
}

// ── Membership tiers (weight-based) ──

export type MembershipTier = "starter" | "standard" | "family";

export interface MembershipTierConfig {
  readonly priceId: string;
  readonly monthlyCents: number;
  readonly pickups: number;
  readonly includedLbs: number;
}

export const STRIPE_IDS = isLive
  ? {
      membership: {
        productId: "prod_UGYUCSP1TmwIy6",
        tiers: {
          starter: { priceId: "price_1TI1N43uBUfrZCbdb7UQsftx", monthlyCents: 7900, pickups: 2, includedLbs: 40 },
          standard: { priceId: "price_1TI1N43uBUfrZCbdvaJxUelt", monthlyCents: 12900, pickups: 4, includedLbs: 80 },
          family: { priceId: "price_1TI1N43uBUfrZCbdRNlxVhwn", monthlyCents: 16900, pickups: 4, includedLbs: 120 },
        } satisfies Record<MembershipTier, MembershipTierConfig>,
        overagePriceId: "price_1THdOE3uBUfrZCbdpf1mDo1i",
        overageRateCents: 195,
        meterId: "mtr_61UR1LQR1lQaIaDuW413uBUfrZCbd0ds",
        meterEventName: "wdl_overage_lbs",
      },
      subscription: {
        productId: "prod_UG9hAT6phE29C0",
        tiers: {
          "biweekly-2": { priceId: "price_1THsTM3uBUfrZCbdcOwFYq6R", monthlyCents: 13996 },
          "weekly-1": { priceId: "price_1THsTM3uBUfrZCbd0uoBtSMy", monthlyCents: 13196 },
          "weekly-2": { priceId: "price_1THsTM3uBUfrZCbd4PgH7Sa7", monthlyCents: 24792 },
        } satisfies Record<LegacySubscriptionTier, LegacyTierPrice>,
        overagePriceId: "price_1THdOE3uBUfrZCbdpf1mDo1i",
        meterId: "mtr_61UR1LQR1lQaIaDuW413uBUfrZCbd0ds",
        meterEventName: "wdl_overage_lbs",
      },
      singleOrder: {
        productId: "prod_UG9h7B9gmI593L",
      },
    }
  : {
      membership: {
        productId: "prod_UGYUCSP1TmwIy6",
        tiers: {
          starter: { priceId: "price_1TI1N43uBUfrZCbdb7UQsftx", monthlyCents: 7900, pickups: 2, includedLbs: 40 },
          standard: { priceId: "price_1TI1N43uBUfrZCbdvaJxUelt", monthlyCents: 12900, pickups: 4, includedLbs: 80 },
          family: { priceId: "price_1TI1N43uBUfrZCbdRNlxVhwn", monthlyCents: 16900, pickups: 4, includedLbs: 120 },
        } satisfies Record<MembershipTier, MembershipTierConfig>,
        overagePriceId: "price_1THUjU3uBUfrZCbddHw0rOhH",
        overageRateCents: 195,
        meterId: "mtr_test_61UQsgqnQW0C1ccZ8413uBUfrZCbdXyS",
        meterEventName: "wdl_overage_lbs",
      },
      subscription: {
        productId: "prod_UG0lAckijhXdgv",
        tiers: {
          "biweekly-2": { priceId: "price_1THsT63uBUfrZCbd5n4GCD9Z", monthlyCents: 13996 },
          "weekly-1": { priceId: "price_1THsT63uBUfrZCbd0TgV3sif", monthlyCents: 13196 },
          "weekly-2": { priceId: "price_1THsT63uBUfrZCbdWhNrEJDr", monthlyCents: 24792 },
        } satisfies Record<LegacySubscriptionTier, LegacyTierPrice>,
        overagePriceId: "price_1THUjU3uBUfrZCbddHw0rOhH",
        meterId: "mtr_test_61UQsgqnQW0C1ccZ8413uBUfrZCbdXyS",
        meterEventName: "wdl_overage_lbs",
      },
      singleOrder: {
        productId: "prod_UG0lZlCA5LXvNI",
      },
    };

export function resolveLegacyTier(
  frequency: "weekly" | "biweekly",
  bags: number,
): LegacySubscriptionTier {
  if (frequency === "biweekly") return "biweekly-2";
  return bags >= 2 ? "weekly-2" : "weekly-1";
}
