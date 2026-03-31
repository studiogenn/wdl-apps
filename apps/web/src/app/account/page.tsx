import type { Metadata } from "next";
import { CleanCloudBooking } from "@/components/integrations/cleancloud-booking";

export const metadata: Metadata = {
  title: "Order Online | We Deliver Laundry",
  description:
    "Schedule your laundry pickup and delivery online. Washed, folded, and returned within 24 hours.",
};

export default function AccountPage() {
  return <CleanCloudBooking />;
}
