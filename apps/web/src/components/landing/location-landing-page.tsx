"use client";

import Image from "next/image";
import { FAQAccordion, StatCard, ButtonLink, SectionHeader } from "@/components/shared";

interface LocationLandingPageProps {
  location: string;
  state: string;
  heroHeading: string;
  heroSubheading: string;
  serviceAreas: string[];
  faqs: { question: string; answer: string }[];
}

export function LocationLandingPage({
  location,
  state,
  heroHeading,
  heroSubheading,
  serviceAreas,
  faqs,
}: LocationLandingPageProps) {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 mb-2">
                {location}, {state}
              </p>
              <SectionHeader heading={heroHeading} headingAs="h1" align="left" headingClassName="mb-4 leading-tight" />
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed mb-5">
                {heroSubheading}
              </p>
              <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy space-y-2.5 mb-7">
                {[
                  "Free Pickup & Delivery",
                  "24-Hour Turnaround",
                  "No Hidden Fees — Pay Per Pound",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <svg
                      className="w-4 h-4 text-navy shrink-0"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                    >
                      <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/account/">
                  Schedule Pick-up
                </ButtonLink>
                <ButtonLink href="/membership" variant="outline">
                  Learn More
                </ButtonLink>
              </div>
            </div>
            <div className="w-full lg:w-[440px] shrink-0">
              <Image
                src="/images/service-areas-hero.jpg"
                alt={`We Deliver Laundry pickup and delivery service in ${location}, ${state}`}
                width={918}
                height={750}
                className="w-full h-auto rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="How it Works" heading={`Laundry Made Simple in ${location}`} headingClassName="mb-3" description="No complicated steps — just easy scheduling, smooth pickup, professional cleaning, and fast delivery back to your door." />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "Step 1",
                image: "/images/step-1-schedule.jpg",
                alt: "Customer scheduling laundry pickup on phone",
                title: "Schedule Pick-up",
                desc: "Choose a pick up and drop off time most convenient for you.",
              },
              {
                step: "Step 2",
                image: "/images/step-2-pickup.jpg",
                alt: "We Deliver Laundry branded bag ready for pickup",
                title: "We Pick Up",
                desc: "A driver will coordinate pickup of your order. Any special instructions you provide will be followed.",
              },
              {
                step: "Step 3",
                image: "/images/step-3-deliver.jpg",
                alt: "We Deliver Laundry van for pickup and delivery",
                title: "We Deliver",
                desc: "Your laundry is professionally cleaned, quality-checked, and delivered back on schedule.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <span className="inline-block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/50 mb-4">
                  {s.step}
                </span>
                <div className="mb-5 rounded-xl overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    width={1200}
                    height={660}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-heading-medium text-navy mb-2">
                  {s.title}
                </h3>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px] text-center">
          <SectionHeader heading={`Areas We Serve in ${location}`} align="left" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-xl mx-auto mb-10">
            Fast, reliable laundry pickup and delivery across {location} and
            surrounding neighborhoods.
          </p>
          <div className="max-w-[600px] mx-auto">
            <div className="bg-white rounded-2xl px-8 py-6 shadow-sm">
              <ul className="columns-2 gap-8 font-[family-name:var(--font-poppins)] text-[15px] text-navy font-light tracking-[-0.03em]">
                {serviceAreas.map((area) => (
                  <li
                    key={area}
                    className="py-2.5 border-b border-navy/10 break-inside-avoid"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* By The Numbers */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="By The Numbers" heading={`Why ${location} Trusts Us`} headingClassName="mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "24 Hour", label: "Delivery Guarantee" },
              { value: "9,000+", label: "Happy Customers" },
              { value: "1,000,000+", label: "Lbs of Laundry Cleaned" },
            ].map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} className="bg-cream py-10" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-14 lg:py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)",
        }}
      >
        <div className="container-site max-w-[700px]">
          <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-16 text-center shadow-sm">
            <SectionHeader heading="Ready to Get Started?" headingClassName="mb-4" />
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
              Join hundreds of {location} residents who&apos;ve reclaimed their
              weekends with our professional laundry pickup and delivery service.
            </p>
            <ButtonLink href="/account/">
              Schedule Pick-up
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20">
        <div className="container-site max-w-[780px]">
          <SectionHeader heading="Frequently Asked Questions" />
          <FAQAccordion items={faqs} />
        </div>
      </section>
    </>
  );
}

