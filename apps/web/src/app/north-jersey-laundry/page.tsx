import type { Metadata } from "next";
import { LocationLandingPage } from "@/components/landing/location-landing-page";

export const metadata: Metadata = {
  title: "Laundry Pickup & Delivery in North Jersey | We Deliver Laundry",
  description:
    "Fast, reliable laundry pickup and delivery in Hudson, Bergen, and Essex Counties. 24-hour turnaround, no hidden fees. Schedule your first pickup today.",
  openGraph: {
    title: "North Jersey Laundry Pickup & Delivery | We Deliver Laundry",
    description:
      "Professional wash & fold service in Hudson, Bergen, and Essex Counties with free pickup and delivery. 24-hour turnaround guaranteed.",
  },
};

export default function NorthJerseyLaundryPage() {
  return (
    <LocationLandingPage
      location="North Jersey"
      state="NJ"
      heroHeading="North Jersey's Premier Laundry Pickup & Delivery"
      heroSubheading="Professional wash & fold service with free pickup and delivery across Hudson, Bergen, and Essex Counties. Schedule online and get your laundry back in 24 hours."
      serviceAreas={[
        // Hudson County
        "Jersey City",
        "Hoboken",
        "Union City",
        "West New York",
        "Bayonne",
        "North Bergen",
        "Secaucus",
        "Weehawken",
        // Bergen County
        "Hackensack",
        "Fort Lee",
        "Teaneck",
        "Englewood",
        "Paramus",
        "Ridgewood",
        "Fair Lawn",
        "Bergenfield",
        // Essex County
        "Newark",
        "East Orange",
        "Irvington",
        "Bloomfield",
        "Montclair",
        "Orange",
        "West Orange",
        "Nutley",
      ]}
      faqs={[
        {
          question: "Which counties do you serve in North Jersey?",
          answer:
            "We serve Hudson County (Jersey City, Hoboken, Union City), Bergen County (Hackensack, Fort Lee, Englewood), and Essex County (Newark, Montclair, East Orange).",
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
            "Yes! We serve both residential customers and commercial clients across Hudson, Bergen, and Essex Counties. Contact us for custom commercial pricing.",
        },
        {
          question: "Is pickup and delivery really free?",
          answer:
            "Yes! We only charge per pound ($1.95-$2.79/lb depending on your plan). No delivery fees, no pickup fees, no hidden charges.",
        },
      ]}
    />
  );
}
