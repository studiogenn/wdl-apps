import type { Metadata } from "next";
import { Suspense } from "react";
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      }
    : null;

  return (
    <Suspense>
      <AccountPageClient user={user} />
    </Suspense>
  );
}
