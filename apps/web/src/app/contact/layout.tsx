import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with We Deliver Laundry. Call 855-968-5511 or send us a message.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
