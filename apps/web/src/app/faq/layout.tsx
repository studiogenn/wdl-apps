import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about We Deliver Laundry pickup and delivery service.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
