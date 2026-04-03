import type { Metadata } from "next";
import { LocationLandingPage } from "@/components/landing/location-landing-page";

export const metadata: Metadata = {
  title: "Laundry Pickup & Delivery in Morristown, NJ | We Deliver Laundry",
  description:
    "Fast, reliable laundry pickup and delivery in Morristown, NJ. 24-hour turnaround, no hidden fees. Schedule your first pickup today.",
  openGraph: {
    title: "Morristown Laundry Pickup & Delivery | We Deliver Laundry",
    description:
      "Professional wash & fold service in Morristown with free pickup and delivery. 24-hour turnaround guaranteed.",
  },
};

export default function MorristownLaundryPage() {
  return (
    <LocationLandingPage
      location="Morristown"
      state="NJ"
      heroHeading="Morristown's Premier Laundry Pickup & Delivery"
      heroSubheading="Professional wash & fold service with free pickup and delivery across Morristown. Schedule online and get your laundry back in 24 hours."
      serviceAreas={[
        "Downtown Morristown",
        "Morris Township",
        "Madison",
        "Convent Station",
        "Morris Plains",
        "Florham Park",
        "East Hanover",
        "Parsippany",
      ]}
      faqs={[
        {
          question: "Do you serve all of Morristown?",
          answer:
            "Yes! We cover all of Morristown including downtown, surrounding townships, and nearby areas like Madison and Morris Plains.",
        },
        {
          question: "What's the minimum order?",
          answer:
            "Our minimum order is $40, which typically covers about 15-20 lbs of laundry.",
        },
        {
          question: "How quickly can you pick up my laundry?",
          answer:
            "Same-day pickup is available when you schedule before noon. Otherwise, we'll pick up the next day at your preferred time.",
        },
        {
          question: "Is pickup and delivery really free?",
          answer:
            "Yes! We only charge per pound ($1.95-$2.99/lb depending on your plan). No delivery fees, no pickup fees, no hidden charges.",
        },
      ]}
    />
  );
}
