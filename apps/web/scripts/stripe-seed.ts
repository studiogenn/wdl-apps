import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.error("STRIPE_SECRET_KEY is required");
  process.exit(1);
}

const stripe = new Stripe(secretKey, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

async function seed() {
  const meter = await stripe.billing.meters.create({
    display_name: "Laundry Overage (lbs)",
    event_name: "wdl_overage_lbs",
    default_aggregation: { formula: "sum" },
  });

  const subProduct = await stripe.products.create({
    name: "WDL Monthly Subscription",
    description: "Monthly laundry subscription — $100 base, $0.02/lb overage",
  });

  const basePrice = await stripe.prices.create({
    product: subProduct.id,
    unit_amount: 10000,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Base — $100/mo",
  });

  const overagePrice = await stripe.prices.create({
    product: subProduct.id,
    unit_amount: 2,
    currency: "usd",
    recurring: {
      interval: "month",
      meter: meter.id,
      usage_type: "metered",
    },
    billing_scheme: "per_unit",
    nickname: "Overage — $0.02/lb",
  });

  const orderProduct = await stripe.products.create({
    name: "WDL Single Order",
    description: "One-time laundry order — variable price, preauthorized",
  });

  console.log("\nStripe products and prices created.\n");
  console.log("Paste these into src/lib/stripe-config.ts:\n");
  console.log(`export const STRIPE_IDS = {
  subscription: {
    productId: "${subProduct.id}",
    basePriceId: "${basePrice.id}",
    overagePriceId: "${overagePrice.id}",
    meterId: "${meter.id}",
    meterEventName: "wdl_overage_lbs",
  },
  singleOrder: {
    productId: "${orderProduct.id}",
  },
} as const;`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
