import type { Metadata } from "next";
import { JoinGate } from "@/components/join/JoinGate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Join — Laundry Membership Plans from $139/month",
  description:
    "Join We Deliver Laundry. Membership plans from $139/month with free pickup & delivery. 4 pickups per month, 80–120 lbs included. Cancel anytime.",
  openGraph: {
    title: "We Deliver Laundry — Join a Membership Plan",
    description:
      "Membership plans from $139/month. Free pickup & delivery, 24-hour turnaround. Cancel anytime.",
    url: "https://wedeliverlaundry.com/join",
  },
  alternates: {
    canonical: "https://wedeliverlaundry.com/join",
  },
};

export default function JoinPage() {
  return <JoinGate />;
}
