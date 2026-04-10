import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getsql } from "@/lib/db/connection";
import { getDb } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ScheduleCalendar } from "@/components/account/schedule-calendar";
import { OrderAuthGate } from "@/components/order/OrderAuthGate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Schedule Pickup | We Deliver Laundry",
  description: "Choose a pickup date and time for your laundry.",
};

async function resolveCustomerId(
  userId: string,
  email: string,
  existing: number | null | undefined
): Promise<number | null> {
  if (existing) return existing;

  try {
    const sql = getsql();
    const [match] = await sql`
      SELECT cleancloud_id AS "cleancloudId"
      FROM stg_cleancloud.stg_cc_customers
      WHERE lower(email) = lower(${email})
        AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!match?.cleancloudId) return null;

    const ccId = match.cleancloudId as number;

    const db = getDb();
    await db
      .update(userTable)
      .set({ cleancloudCustomerId: ccId })
      .where(eq(userTable.id, userId));

    return ccId;
  } catch {
    return null;
  }
}

export default async function SchedulePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/account?flag=new-account");
  }

  const rawId = (session.user as Record<string, unknown>)
    .cleancloudCustomerId as number | undefined;

  const customerId = await resolveCustomerId(
    session.user.id,
    session.user.email,
    rawId ?? null
  );

  if (!customerId) {
    return <OrderAuthGate needsCleanCloud />;
  }

  return <ScheduleCalendar customerId={customerId} />;
}
