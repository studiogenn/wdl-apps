import type { Metadata } from "next";
import { LocationLandingPage } from "@/components/landing/location-landing-page";

export const metadata: Metadata = {
  title: "Laundry Pickup & Delivery in Brooklyn, NY | We Deliver Laundry",
  description:
    "Fast, reliable laundry pickup and delivery in Brooklyn, NY. 24-hour turnaround, no hidden fees. Schedule your first pickup today.",
  openGraph: {
    title: "Brooklyn Laundry Pickup & Delivery | We Deliver Laundry",
    description:
      "Professional wash & fold service in Brooklyn with free pickup and delivery. 24-hour turnaround guaranteed.",
  },
};

export default function BrooklynLaundryPage() {
  return (
    <LocationLandingPage
      location="Brooklyn"
      state="NY"
      heroHeading="Brooklyn's Premier Laundry Pickup & Delivery"
      heroSubheading="Professional wash & fold service with free pickup and delivery across Brooklyn. Schedule online and get your laundry back in 24 hours."
      serviceAreas={[
        "Williamsburg",
        "DUMBO",
        "Brooklyn Heights",
        "Park Slope",
        "Fort Greene",
        "Cobble Hill",
        "Carroll Gardens",
        "Boerum Hill",
        "Gowanus",
        "Red Hook",
        "Greenpoint",
        "Bedford-Stuyvesant",
        "Crown Heights",
        "Prospect Heights",
        "Clinton Hill",
        "Downtown Brooklyn",
      ]}
      faqs={[
        {
          question: "Which Brooklyn neighborhoods do you serve?",
          answer:
            "We serve all major Brooklyn neighborhoods including Williamsburg, DUMBO, Brooklyn Heights, Park Slope, Fort Greene, and many more. Check the service areas list above for your specific neighborhood.",
        },
        {
          question: "What's the minimum order?",
          answer:
            "Our minimum order is $40, which typically covers about 15-20 lbs of laundry.",
        },
        {
          question: "Can I schedule same-day pickup?",
          answer:
            "Yes! Same-day pickup is available when you schedule before noon. Otherwise, we'll pick up the next day at your preferred time.",
        },
        {
          question: "How do I know when my laundry will be delivered?",
          answer:
            "You choose your delivery window when scheduling. We guarantee 24-hour turnaround from pickup to delivery.",
        },
      ]}
    />
  );
}
