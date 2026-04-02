import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing/PricingPage";
import { AddressGate } from "@/components/pricing/AddressGate";

export const metadata: Metadata = {
  title: "Pricing — Laundry Pickup & Delivery Plans",
  description:
    "Laundry subscription plans from $30.99/bag or pay-as-you-go at $2.75/lb. Free pickup and delivery in NYC & New Jersey. No contracts, cancel anytime.",
  openGraph: {
    title: "We Deliver Laundry — Pricing Plans",
    description:
      "Subscription plans from $30.99/bag or one-time orders at $2.75/lb. Free pickup and delivery in NYC & NJ.",
    url: "https://wedeliverlaundry.com/pricing",
  },
  alternates: {
    canonical: "https://wedeliverlaundry.com/pricing",
  },
};

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Laundry Pickup and Delivery Service",
  name: "We Deliver Laundry — Subscription & One-Time Plans",
  description:
    "Professional laundry pickup and delivery service with subscription plans from $30.99/bag and one-time orders at $2.75/lb. Free pickup and delivery. 24-hour turnaround.",
  url: "https://wedeliverlaundry.com/pricing",
  provider: {
    "@type": "DryCleaningOrLaundry",
    name: "We Deliver Laundry",
    url: "https://wedeliverlaundry.com",
    telephone: "+18559685511",
  },
  areaServed: [
    { "@type": "State", name: "New York" },
    { "@type": "State", name: "New Jersey" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Laundry Plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Weekly Subscription",
        description: "1 bag per week, ~15-18 lbs per bag, free pickup and delivery",
        price: "30.99",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "30.99",
          priceCurrency: "USD",
          referenceQuantity: { "@type": "QuantitativeValue", value: "1", unitText: "bag" },
        },
      },
      {
        "@type": "Offer",
        name: "Pay-As-You-Go",
        description: "One-time wash and fold, $2.75/lb, 48hr turnaround",
        price: "2.75",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "2.75",
          priceCurrency: "USD",
          referenceQuantity: { "@type": "QuantitativeValue", value: "1", unitText: "lb" },
        },
      },
      {
        "@type": "Offer",
        name: "Student Plan",
        description: "Student discount, $24.99/bag with .edu email verification",
        price: "24.99",
        priceCurrency: "USD",
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <AddressGate>
        <PricingPage />
      </AddressGate>
    </>
  );
}
