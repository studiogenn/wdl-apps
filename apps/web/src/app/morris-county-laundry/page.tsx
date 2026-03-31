import type { Metadata } from "next";
import { LocationLandingPage } from "@/components/landing/location-landing-page";

export const metadata: Metadata = {
  title: "Laundry Pickup & Delivery in Morris County, NJ | We Deliver Laundry",
  description:
    "Fast, reliable laundry pickup and delivery across Morris County, NJ. 24-hour turnaround, no hidden fees. Schedule your first pickup today.",
  openGraph: {
    title: "Morris County Laundry Pickup & Delivery | We Deliver Laundry",
    description:
      "Professional wash & fold service across Morris County with free pickup and delivery. 24-hour turnaround guaranteed.",
  },
};

export default function MorrisCountyLaundryPage() {
  return (
    <LocationLandingPage
      location="Morris County"
      state="NJ"
      heroHeading="Morris County's Premier Laundry Pickup & Delivery"
      heroSubheading="Professional wash & fold service with free pickup and delivery across all of Morris County. Schedule online and get your laundry back in 24 hours."
      serviceAreas={[
        "Morristown",
        "Parsippany-Troy Hills",
        "Dover",
        "Madison",
        "Hanover Township",
        "Randolph",
        "Roxbury Township",
        "Chester Township",
        "Morris Township",
        "East Hanover",
        "Florham Park",
        "Denville",
        "Rockaway Township",
        "Montville",
        "Boonton",
        "Mount Olive",
      ]}
      faqs={[
        {
          question: "Do you serve all of Morris County?",
          answer:
            "Yes! We provide pickup and delivery service throughout Morris County including Morristown, Parsippany, Dover, Madison, and all surrounding townships.",
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
          question: "Do you serve both residential and commercial customers?",
          answer:
            "Yes! We serve both residential customers and commercial clients throughout Morris County. Contact us for custom commercial pricing.",
        },
      ]}
    />
  );
}
