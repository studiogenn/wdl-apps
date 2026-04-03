import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.error("STRIPE_SECRET_KEY is required");
  process.exit(1);
}
if (!secretKey.startsWith("sk_live_")) {
  console.error("This script must be run with a LIVE Stripe key");
  process.exit(1);
}

const stripe = new Stripe(secretKey, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

async function createMembershipTiers() {
  console.log("Creating WDL Membership product and tier prices in PRODUCTION...\n");

  const product = await stripe.products.create({
    name: "WDL Membership",
    description: "We Deliver Laundry — monthly membership with included weight and pickups",
  });
  console.log(`Product: ${product.id}`);

  // Starter: $79/mo, 2 pickups/mo, 40 lbs included
  const starter = await stripe.prices.create({
    product: product.id,
    unit_amount: 7900,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Starter — $79/mo (2 pickups, 40 lbs)",
    metadata: { tier: "starter", pickups: "2", includedLbs: "40" },
  });
  console.log(`Starter: ${starter.id}`);

  // Standard: $129/mo, 4 pickups/mo, 80 lbs included
  const standard = await stripe.prices.create({
    product: product.id,
    unit_amount: 12900,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Standard — $129/mo (4 pickups, 80 lbs)",
    metadata: { tier: "standard", pickups: "4", includedLbs: "80" },
  });
  console.log(`Standard: ${standard.id}`);

  // Family: $169/mo, 4 pickups/mo, 120 lbs included
  const family = await stripe.prices.create({
    product: product.id,
    unit_amount: 16900,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Family — $169/mo (4 pickups, 120 lbs)",
    metadata: { tier: "family", pickups: "4", includedLbs: "120" },
  });
  console.log(`Family: ${family.id}`);

  // Reusing existing live overage price + meter ($1.95/lb)
  const existingOveragePriceId = "price_1THdOE3uBUfrZCbdpf1mDo1i";
  const existingMeterId = "mtr_61UR1LQR1lQaIaDuW413uBUfrZCbd0ds";

  console.log("\n--- Paste into stripe-config.ts (membership section) ---\n");
  console.log(`membership: {
  productId: "${product.id}",
  tiers: {
    starter: { priceId: "${starter.id}", monthlyCents: 7900, pickups: 2, includedLbs: 40 },
    standard: { priceId: "${standard.id}", monthlyCents: 12900, pickups: 4, includedLbs: 80 },
    family: { priceId: "${family.id}", monthlyCents: 16900, pickups: 4, includedLbs: 120 },
  },
  overagePriceId: "${existingOveragePriceId}",
  overageRateCents: 195,
  meterId: "${existingMeterId}",
  meterEventName: "wdl_overage_lbs",
},`);
}

createMembershipTiers().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
