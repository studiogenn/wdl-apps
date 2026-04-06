import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing/PricingPage";

export const metadata: Metadata = {
  title: "Subscriptions — Laundry Plans & One-Time Orders",
  description:
    "Build your laundry plan from $30.99/bag or order one-time at $2.75/lb. Free pickup & delivery in NYC & New Jersey. No contracts, cancel anytime.",
  openGraph: {
    title: "We Deliver Laundry — Subscriptions",
    description:
      "Laundry plans from $30.99/bag or one-time at $2.75/lb. Free pickup & delivery in NYC & NJ.",
    url: "https://wedeliverlaundry.com/subscriptions",
  },
  alternates: {
    canonical: "https://wedeliverlaundry.com/subscriptions",
  },
};

export default function SubscriptionsPage() {
  return <PricingPage />;
}
