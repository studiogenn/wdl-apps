import type { Metadata } from "next";
import { LocationLandingPage } from "@/components/landing/location-landing-page";

export const metadata: Metadata = {
  title: "Laundry Pickup & Delivery in Queens, NY | We Deliver Laundry",
  description:
    "Fast, reliable laundry pickup and delivery in Queens, NY. 24-hour turnaround, no hidden fees. Schedule your first pickup today.",
  openGraph: {
    title: "Queens Laundry Pickup & Delivery | We Deliver Laundry",
    description:
      "Professional wash & fold service in Queens with free pickup and delivery. 24-hour turnaround guaranteed.",
  },
};

export default function QueensLaundryPage() {
  return (
    <LocationLandingPage
      location="Queens"
      state="NY"
      heroHeading="Queens' Premier Laundry Pickup & Delivery"
      heroSubheading="Professional wash & fold service with free pickup and delivery across Queens. Schedule online and get your laundry back in 24 hours."
      serviceAreas={[
        "Astoria",
        "Long Island City",
        "Sunnyside",
        "Woodside",
        "Jackson Heights",
        "Elmhurst",
        "Forest Hills",
        "Rego Park",
        "Flushing",
        "Bayside",
        "Ridgewood",
        "Glendale",
        "Middle Village",
        "Maspeth",
        "Corona",
        "Kew Gardens",
      ]}
      faqs={[
        {
          question: "Which Queens neighborhoods do you serve?",
          answer:
            "We serve all major Queens neighborhoods including Astoria, Long Island City, Flushing, Forest Hills, Bayside, and many more. Check the service areas list above for your specific neighborhood.",
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
          question: "Do you wash everything together or separate colors?",
          answer:
            "We follow your specific instructions. Let us know if you need colors separated, delicates handled specially, or any other preferences when you schedule.",
        },
      ]}
    />
  );
}
