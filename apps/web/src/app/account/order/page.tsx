import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { OrderForm } from "@/components/account/order-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Place an Order | We Deliver Laundry",
  description:
    "Place a single laundry order with pre-authorized payment. Only charged for actual weight.",
};

export default async function OrderPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/account");
  }

  return <OrderForm />;
}
