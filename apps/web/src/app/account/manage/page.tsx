import type { Metadata } from "next";
import { CleanCloudBooking } from "@/components/integrations/cleancloud-booking";

export const metadata: Metadata = {
  title: "My Account | We Deliver Laundry",
  description: "Manage your laundry pickups, orders, and account settings.",
};

export default function AccountManagePage() {
  return <CleanCloudBooking />;
}
