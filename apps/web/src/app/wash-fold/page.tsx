"use client";

import Image from "next/image";
import { ZipChecker } from "@/components/home/ZipChecker";
import { FAQAccordion, ButtonLink, SectionHeader } from "@/components/shared";

const washFoldSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Wash and Fold Laundry Service",
  description: "Professional wash and fold laundry service with pickup and delivery. Starting at $1.95/lb with 24-hour turnaround.",
  url: "https://wedeliverlaundry.com/wash-fold",
  provider: {
    "@type": "DryCleaningOrLaundry",
    name: "We Deliver Laundry",
    url: "https://wedeliverlaundry.com",
    telephone: "+18559685511",
  },
  areaServed: [{ "@type": "State", name: "New York" }, { "@type": "State", name: "New Jersey" }],
};

export default function WashFoldPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(washFoldSchema) }}
      />
      {/* Hero */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <SectionHeader heading="Simple, Transparent Laundry Pricing" align="left" headingClassName="mb-4 leading-tight" />
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed mb-5">
                No subscriptions, no hidden fees, just clear pricing for fast,
                reliable wash &amp; fold service.
              </p>
              <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy space-y-2.5 mb-7">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Fresh, professionally cleaned clothes
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Washed, dried, and neatly folded
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Delivered back to you within 24 hours
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/account/">
                  Schedule Pick-up
                </ButtonLink>
                <ButtonLink href="#zipcode" variant="outline">
                  Check Zip Code
                </ButtonLink>
              </div>
            </div>
            <div className="w-full lg:w-[440px] shrink-0">
              <Image
                src="/images/wash-fold-hero.png"
                alt="We Deliver Laundry team members in branded uniforms at laundromat facility"
                width={940}
                height={517}
                className="w-full h-auto rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pick the Service */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <div className="text-center mb-12">
            <SectionHeader heading="Pick the Service That Fits Your Needs" align="left" headingClassName="mb-3" />
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-xl mx-auto">
              Choose a plan that fits your routine and budget, same reliable
              service, simple per-pound pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pay As You Go */}
            <div className="bg-white rounded-2xl p-8 flex flex-col">
              <h3 className="text-lg font-heading-medium text-navy mb-1">Pay As You Go</h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 mb-5">No commitment</p>
              <div className="mb-6">
                <span className="text-[2.5rem] font-body-bold text-navy">$2.79</span>
                <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">/lb</span>
              </div>
              <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Free pickup &amp; delivery
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  24-hour turnaround
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Professional wash, dry &amp; fold
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  $40 minimum order
                </li>
              </ul>
              <ButtonLink href="/account/" className="block w-full text-center">
                Schedule Pick-up
              </ButtonLink>
            </div>

            {/* Biweekly Plan */}
            <div className="bg-white rounded-2xl p-8 flex flex-col">
              <h3 className="text-lg font-heading-medium text-navy mb-1">Biweekly Plan</h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 mb-5">Every other week pickup</p>
              <div className="mb-6">
                <span className="text-[2.5rem] font-body-bold text-navy">$2.15</span>
                <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">/lb</span>
              </div>
              <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Free pickup &amp; delivery
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  24-hour turnaround
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Professional wash, dry &amp; fold
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  $40 minimum order
                </li>
              </ul>
              <ButtonLink href="/account/" className="block w-full text-center">
                Schedule Pick-up
              </ButtonLink>
            </div>

            {/* Weekly Plan */}
            <div className="bg-white rounded-2xl p-8 flex flex-col border-2 border-primary relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full">
                Best Value
              </span>
              <h3 className="text-lg font-heading-medium text-navy mb-1">Weekly Plan</h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 mb-5">Weekly pickup</p>
              <div className="mb-6">
                <span className="text-[2.5rem] font-body-bold text-navy">$1.95</span>
                <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">/lb</span>
              </div>
              <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Free pickup &amp; delivery
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  24-hour turnaround
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Professional wash, dry &amp; fold
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  $40 minimum order
                </li>
              </ul>
              <ButtonLink href="/account/" className="block w-full text-center">
                Schedule Pick-up
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* How We Calculate */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="How it Works" heading="How We Calculate Your Price" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-xl mx-auto mb-14">
            We keep pricing simple and transparent. Your final cost is based on
            the total weight of your laundry — no estimates, no guesswork.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full mb-5">
                Step 1
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-1-weigh.png"
                  alt="Digital scale weighing laundry for accurate pricing"
                  width={940}
                  height={517}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                We Weigh Your Laundry
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Once your laundry arrives, we weigh the full order to calculate
                the total weight.
              </p>
            </div>
            <div className="text-center">
              <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full mb-5">
                Step 2
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-2-priced.png"
                  alt="Transparent per-pound pricing calculation"
                  width={940}
                  height={517}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                Priced by the Pound
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Pricing is calculated using your selected plan rate per pound,
                so you only pay for what you send.
              </p>
            </div>
            <div className="text-center">
              <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full mb-5">
                Step 3
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-3-cleaned.png"
                  alt="Clean folded laundry ready for delivery"
                  width={940}
                  height={517}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                Cleaned &amp; Delivered
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Your clothes are professionally washed, folded, and delivered
                back to you within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* By The Numbers */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="By The Numbers" heading="Trust Building Success Metrics" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-2xl mx-auto mb-12">
            We don&apos;t love bragging, but the numbers don&apos;t lie — quick
            delivery, thousands of happy customers, and more clean laundry than
            we can count.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "⏰", value: "24 Hour", label: "Delivery Guarantee" },
              { icon: "😊", value: "9,000+", label: "Happy Customers" },
              { icon: "👕", value: "1,000,000+", label: "Lbs of Laundry Cleaned" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-cream rounded-xl px-6 py-10 text-center"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-[1.75rem] font-body-medium text-navy mb-1">
                  {stat.value}
                </p>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Check Zip Code */}
      <section id="zipcode" className="py-14 lg:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)" }}>
        <div className="container-site max-w-[700px]">
          <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-16 text-center shadow-sm">
            <SectionHeader heading="Check if We Deliver to You" headingClassName="mb-4" />
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
              Enter your zip code to see if we offer pickup and delivery in your area.
            </p>
            <ZipChecker />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20" style={{ background: "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)" }}>
        <div className="container-site max-w-[780px]">
          <SectionHeader heading="Frequently Asked Questions" />
          <FAQAccordion items={WASH_FOLD_FAQ} />
        </div>
      </section>
    </>
  );
}

const WASH_FOLD_FAQ = [
  {
    question: "How much is the service?",
    answer:
      "We have different options depending on your lifestyle! Pay As You Go at $2.79/lb, Biweekly Plan at $2.15/lb, or Weekly Plan at $1.95/lb.",
  },
  {
    question: "How much is the delivery fee?",
    answer:
      "There is no delivery fee! We only charge per pound. $40 minimum order.",
  },
  {
    question: "Is there a limit on how much I can send?",
    answer: "No limit! Send as much as you need.",
  },
  {
    question: "Do you have discounts available?",
    answer:
      "Yes! Our Weekly Plan saves you significantly compared to Pay As You Go pricing.",
  },
];
