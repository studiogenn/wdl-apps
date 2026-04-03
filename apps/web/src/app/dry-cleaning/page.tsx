"use client";

import Image from "next/image";
import { ZipChecker } from "@/components/home/ZipChecker";
import { FAQAccordion, ButtonLink, SectionHeader } from "@/components/shared";

const dryCleaningSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Dry Cleaning Service",
  description: "Professional dry cleaning with free pickup and delivery. Starting at $5.99 per item with 3-day turnaround.",
  url: "https://wedeliverlaundry.com/dry-cleaning",
  provider: {
    "@type": "DryCleaningOrLaundry",
    name: "We Deliver Laundry",
    url: "https://wedeliverlaundry.com",
    telephone: "+18559685511",
  },
  areaServed: [{ "@type": "State", name: "New York" }, { "@type": "State", name: "New Jersey" }],
};

export default function DryCleaningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dryCleaningSchema) }}
      />
      {/* Hero */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <SectionHeader heading="Professional Dry Cleaning, Picked Up &amp; Delivered" align="left" headingClassName="mb-4 leading-tight" />
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed mb-5">
                Expert care for your delicate garments — suits, dresses, coats,
                and more. Free pickup and delivery with 3-day turnaround.
              </p>
              <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy space-y-2.5 mb-7">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Expert stain removal
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Gentle on delicate fabrics
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Free pickup &amp; delivery
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/account/">
                  Schedule Pickup
                </ButtonLink>
                <ButtonLink href="#zipcode" variant="outline">
                  Check Zip Code
                </ButtonLink>
              </div>
            </div>
            <div className="w-full lg:w-[440px] shrink-0">
              <Image
                src="/images/commercial-hero.png"
                alt="Professional dry cleaning pickup and delivery service"
                width={940}
                height={517}
                className="w-full h-auto rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="How it Works" heading="Dry Cleaning Pickup &amp; Delivery, Explained" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-xl mx-auto mb-14">
            We handle everything from pickup to delivery so you never have to
            visit the dry cleaner again.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full mb-5">
                Step 1
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-1-schedule.jpg"
                  alt="Schedule a dry cleaning pickup online"
                  width={940}
                  height={517}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                Schedule a Pickup
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Choose a pickup time that works for you. We&apos;ll come to your
                door.
              </p>
            </div>
            <div className="text-center">
              <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full mb-5">
                Step 2
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-2-pickup.jpg"
                  alt="Driver collecting garments for dry cleaning"
                  width={940}
                  height={517}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                We Pick Up
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Our driver collects your garments and follows any special care
                instructions.
              </p>
            </div>
            <div className="text-center">
              <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full mb-5">
                Step 3
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-3-deliver.jpg"
                  alt="Clean garments delivered back to your door"
                  width={940}
                  height={517}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                Cleaned &amp; Delivered
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Your clothes are professionally dry cleaned and returned within 3
                days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <div className="text-center mb-12">
            <SectionHeader heading="Simple, Transparent Dry Cleaning Pricing" align="left" headingClassName="mb-3" />
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-xl mx-auto">
              Professional dry cleaning priced per item. $50 minimum order. Free
              pickup &amp; delivery.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
            {PRICING_ITEMS.map((item, index) => (
              <div
                key={item.name}
                className={`flex items-center justify-between py-4 ${index < PRICING_ITEMS.length - 1 ? "border-b border-navy/10" : ""}`}
              >
                <span className="font-[family-name:var(--font-poppins)] text-[15px] text-navy">
                  {item.name}
                </span>
                <span className="text-lg font-body-medium text-navy">
                  {item.price}
                </span>
              </div>
            ))}
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 mt-6 text-center">
              Prices may vary for specialty items. Contact us for a custom quote.
            </p>
          </div>

          <div className="text-center mt-8">
            <ButtonLink href="/account/">
              Schedule Pickup
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* By The Numbers */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="By The Numbers" heading="Trust Building Success Metrics" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-2xl mx-auto mb-12">
            We don&apos;t love bragging, but the numbers don&apos;t lie —
            thousands of happy customers and more clean clothes than we can
            count.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cream rounded-xl px-6 py-10 text-center">
              <div className="flex justify-center mb-3">
                <svg className="w-10 h-10 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <p className="text-[1.75rem] font-body-medium text-navy mb-1">
                3 Day
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
                Turnaround Time
              </p>
            </div>
            <div className="bg-cream rounded-xl px-6 py-10 text-center">
              <div className="flex justify-center mb-3">
                <svg className="w-10 h-10 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <p className="text-[1.75rem] font-body-medium text-navy mb-1">
                9,000+
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
                Happy Customers
              </p>
            </div>
            <div className="bg-cream rounded-xl px-6 py-10 text-center">
              <div className="flex justify-center mb-3">
                <svg className="w-10 h-10 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 3.46L16 2 12 5.5 8 2 3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6l-1 12h14l-1-12h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                </svg>
              </div>
              <p className="text-[1.75rem] font-body-medium text-navy mb-1">
                1,000,000+
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
                Lbs of Laundry Cleaned
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Check Zip Code */}
      <section id="zipcode" className="py-14 lg:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)" }}>
        <div className="container-site max-w-[700px]">
          <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-16 text-center shadow-sm">
            <SectionHeader heading="Check if We Deliver to You" headingClassName="mb-4" />
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
              Enter your zip code to see if we offer dry cleaning pickup and delivery in your area.
            </p>
            <ZipChecker />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20" style={{ background: "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)" }}>
        <div className="container-site max-w-[780px]">
          <SectionHeader heading="Frequently Asked Questions" />
          <FAQAccordion items={DRY_CLEANING_FAQ} />
        </div>
      </section>
    </>
  );
}

const PRICING_ITEMS = [
  { name: "Suits (2-piece)", price: "$18.99" },
  { name: "Dress Shirt", price: "$5.99" },
  { name: "Pants/Trousers", price: "$8.99" },
  { name: "Dress", price: "$14.99" },
  { name: "Coat/Jacket", price: "$16.99" },
  { name: "Tie", price: "$5.99" },
];

const DRY_CLEANING_FAQ = [
  {
    question: "How much does dry cleaning cost?",
    answer:
      "Pricing is per item, starting at $5.99. $50 minimum order.",
  },
  {
    question: "How long does dry cleaning take?",
    answer:
      "Standard turnaround is 3 business days from pickup.",
  },
  {
    question: "Is there a delivery fee?",
    answer:
      "No! Pickup and delivery are always free.",
  },
  {
    question: "Can I combine dry cleaning with wash & fold?",
    answer:
      "Yes! You can schedule both services in the same pickup.",
  },
];
