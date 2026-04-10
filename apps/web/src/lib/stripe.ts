import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (_stripe) return _stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }

  _stripe = new Stripe(secretKey, {
    apiVersion: "2026-02-25.clover" as Stripe.LatestApiVersion,
    typescript: true,
  });

  return _stripe;
}
