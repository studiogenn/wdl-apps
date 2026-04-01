import type { Metadata } from "next";
import { AccountPageClient } from "./account-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Online | We Deliver Laundry",
  description:
    "Schedule your laundry pickup and delivery online. Washed, folded, and returned within 24 hours.",
};

export default function AccountPage() {
  return <AccountPageClient />;
}
