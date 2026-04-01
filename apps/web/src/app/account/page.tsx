import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AccountPageClient } from "./account-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Online | We Deliver Laundry",
  description:
    "Schedule your laundry pickup and delivery online. Washed, folded, and returned within 24 hours.",
};

export default async function AccountPage() {
  let user: { id: string; name: string; email: string } | null = null;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user) {
      user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
    }
  } catch {
    // No session or auth unavailable — continue as unauthenticated
  }

  return <AccountPageClient user={user} />;
}
