import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ScheduleCalendar } from "@/components/account/schedule-calendar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Schedule Pickup | We Deliver Laundry",
  description: "Choose a pickup date and time for your laundry.",
};

export default async function SchedulePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/account");
  }

  const customerId = (session.user as Record<string, unknown>)
    .cleancloudCustomerId as number | undefined;

  if (!customerId) {
    redirect("/account");
  }

  return <ScheduleCalendar customerId={customerId} />;
}
