import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarket, getAllMarketSlugs } from "./data";
import { LocationForm } from "./location-form";
import { ButtonLink, SectionHeader, FAQAccordion } from "@/components/shared";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllMarketSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const market = getMarket(slug);
  if (!market) return {};

  const url = `https://wedeliverlaundry.com/${market.slug}`;

  return {
    title: market.metaTitle,
    description: market.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: market.metaTitle,
      description: market.metaDescription,
      url,
      type: "website",
    },
  };
}

export default async function Tier1Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const market = getMarket(slug);
  if (!market) notFound();

  const phone = "+18559685511";

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DryCleaningOrLaundry",
            name: `We Deliver Laundry — ${market.name}`,
            description: market.metaDescription,
            url: `https://wedeliverlaundry.com/${market.slug}`,
            telephone: phone,
            areaServed: {
              "@type": market.schemaAreaType,
              name: market.name,
            },
            priceRange: "$1.95 - $2.70/lb",
          }),
        }}
      />

      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[100px] -right-[120px] w-[500px] h-[500px] rounded-full bg-light-blue/[0.09]" />
          <div className="absolute -bottom-[140px] -left-[80px] w-[400px] h-[400px] rounded-full bg-highlight/[0.05]" />
        </div>

        <div className="container-site max-w-[1200px] relative z-10 py-[60px] lg:py-[100px]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_480px] gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-highlight" />
                <span className="font-[family-name:var(--font-poppins)] text-[10px] font-semibold uppercase tracking-[2.5px] text-light-blue">
                  Serving {market.name}, {market.state}
                </span>
              </div>

              <h1 className="text-[36px] md:text-[44px] lg:text-[54px] font-bold text-white leading-[1.08] uppercase tracking-[0.3px] mb-[18px]">
                {market.headline}
              </h1>

              <p className="font-[family-name:var(--font-poppins)] text-[15px] md:text-[17px] text-white/75 leading-[1.7] mb-7 max-w-[520px]">
                {market.heroCopy}
              </p>

              <div className="flex flex-wrap gap-2 mb-7">
                {market.pickupWindows.map((w) => (
                  <span
                    key={w.label}
                    className="inline-flex items-center gap-1.5 bg-white/10 border border-white/[0.18] rounded-[14px] px-3.5 py-1.5"
                  >
                    <span className="font-[family-name:var(--font-poppins)] text-[12px] text-white">
                      {w.label}: {w.time}
                    </span>
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/[0.18] rounded-[14px] px-3.5 py-1.5">
                  <span className="font-[family-name:var(--font-poppins)] text-[12px] text-white">
                    {market.turnaround} turnaround
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <ButtonLink
                  href="/account/"
                  className="bg-highlight text-primary font-bold text-[13px] uppercase tracking-[1.5px] py-[15px] px-8 rounded-[4px] hover:bg-highlight"
                >
                  Schedule Pickup
                </ButtonLink>
                <ButtonLink
                  href="/wash-fold/"
                  variant="outline"
                  className="border-white/[0.22] text-white/80 font-bold text-[13px] uppercase tracking-[1.5px] py-[15px] px-8 rounded-[4px]"
                >
                  View Pricing
                </ButtonLink>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="w-full max-w-[400px] bg-white/[0.07] border border-white/[0.14] rounded-2xl p-7 backdrop-blur-sm">
                <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold uppercase tracking-[2px] text-light-blue mb-4">
                  How pickup works
                </p>
                <p className="font-[family-name:var(--font-poppins)] text-[14px] text-white/80 leading-[1.7] mb-5">
                  {market.pickupStyle}
                </p>
                <div className="border-t border-white/10 pt-5">
                  <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold uppercase tracking-[2px] text-light-blue mb-3">
                    Pickup windows
                  </p>
                  <div className="flex flex-col gap-2">
                    {market.pickupWindows.map((w) => (
                      <div key={w.label} className="flex justify-between">
                        <span className="font-[family-name:var(--font-poppins)] text-[13px] text-white/60">
                          {w.label}
                        </span>
                        <span className="font-[family-name:var(--font-poppins)] text-[13px] text-white font-semibold">
                          {w.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5">
                  <ButtonLink
                    href="/account/"
                    className="block w-full bg-highlight text-primary text-center font-bold text-[13px] uppercase tracking-[1.5px] py-[15px] rounded-[4px] hover:bg-highlight"
                  >
                    Schedule Pickup
                  </ButtonLink>
                  <p className="font-[family-name:var(--font-poppins)] text-[10px] text-white/35 text-center mt-2.5">
                    Starting at $1.95/lb · Free pickup &amp; delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-navy/10 py-4">
        <div className="container-site max-w-[1200px] flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-[13px] text-amber-500">★</span>
            ))}
          </div>
          <span className="font-[family-name:var(--font-poppins)] text-[12px] text-navy/60 font-medium">
            4.9 · 200+ happy customers
          </span>
          <div className="hidden sm:block w-px h-[22px] bg-navy/10" />
          <span className="font-[family-name:var(--font-poppins)] text-[12px] text-navy/60 font-medium">
            {market.turnaround} turnaround
          </span>
          <div className="hidden sm:block w-px h-[22px] bg-navy/10" />
          <span className="font-[family-name:var(--font-poppins)] text-[12px] text-navy/60 font-medium">
            Free pickup &amp; delivery
          </span>
        </div>
      </div>

      <section className="bg-white py-[60px]">
        <div className="container-site max-w-[1200px]">
          <SectionHeader
            eyebrow="How it Works"
            heading={`Pickup & Delivery in ${market.name}`}
            headingClassName="mb-7"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              {
                n: "01",
                title: "Schedule your pickup",
                body: `Book online — pick your window and we'll be there. ${market.pickupWindows.map((w) => `${w.label}: ${w.time}`).join(". ")}.`,
              },
              {
                n: "02",
                title: "We pick up",
                body: market.pickupStyle,
              },
              {
                n: "03",
                title: `Back in ${market.turnaround}`,
                body: "Professionally washed, dried, and folded. No harsh chemicals. Delivered back to your door.",
              },
              {
                n: "04",
                title: "Repeat & save",
                body: "Go weekly at $1.95/lb and save 28% vs pay-as-you-go. Cancel anytime.",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className={`py-7 lg:py-0 lg:pr-10 ${i < 3 ? "border-b lg:border-b-0 lg:border-r border-navy/10 lg:mr-10" : ""}`}
              >
                <div
                  className="text-[36px] font-bold leading-none mb-3"
                  style={{ color: "transparent", WebkitTextStroke: "1.5px var(--color-primary)" }}
                >
                  {step.n}
                </div>
                <h3 className="font-[family-name:var(--font-poppins)] text-[15px] font-bold text-navy mb-1.5">
                  {step.title}
                </h3>
                <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/60 leading-[1.6]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-[60px]">
        <div className="container-site max-w-[1200px]">
          <SectionHeader eyebrow="Pricing" heading="Simple. Per-Pound." headingClassName="mb-7" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="relative bg-white border-2 border-primary rounded-[10px] p-7">
              <div className="absolute -top-px right-5 bg-primary text-white font-[family-name:var(--font-poppins)] text-[9px] font-bold uppercase tracking-[1.2px] px-3.5 py-1.5 rounded-b-lg">
                Most popular
              </div>
              <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold uppercase tracking-[1.8px] text-navy/50 mb-2.5">
                Weekly Plan
              </p>
              <p className="text-[48px] font-bold text-primary leading-none">$1.95</p>
              <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/50 mt-1.5 mb-5">
                per pound · recurring weekly pickup
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  "Free pickup & delivery",
                  "Priority scheduling",
                  "Consistent weekly driver",
                  "Save 28% vs pay-as-you-go",
                  "Cancel anytime",
                ].map((perk) => (
                  <div key={perk} className="flex items-center gap-2 font-[family-name:var(--font-poppins)] text-[12px] text-navy/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {perk}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border-[1.5px] border-navy/10 rounded-[10px] p-7">
              <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold uppercase tracking-[1.8px] text-navy/60 mb-2.5">
                Pay as you go
              </p>
              <p className="text-[48px] font-bold text-navy leading-none">$2.70</p>
              <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/50 mt-1.5 mb-5">
                per pound · no commitment required
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  "Free pickup & delivery",
                  "Schedule anytime",
                  "No subscription required",
                  `Same ${market.turnaround} turnaround`,
                ].map((perk) => (
                  <div key={perk} className="flex items-center gap-2 font-[family-name:var(--font-poppins)] text-[12px] text-navy/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy/50 shrink-0" />
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <ButtonLink href="/account/" className="font-bold text-[13px] uppercase tracking-[1.6px] py-4 px-10 rounded-[4px]">
              Schedule Pickup →
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-primary">
        <div className="container-site max-w-[1200px] py-[70px] lg:py-[80px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="font-[family-name:var(--font-poppins)] text-[10px] font-bold text-white/45 uppercase tracking-[2.5px] block mb-2.5">
                Service area
              </span>
              <h2 className="text-[30px] md:text-[36px] lg:text-[42px] font-bold text-white uppercase leading-[1.1] mb-3.5">
                Neighborhoods we serve
              </h2>
              <div className="flex flex-wrap gap-2 mt-6">
                {market.neighborhoods.map((n, i) => (
                  <span
                    key={n}
                    className={`font-[family-name:var(--font-poppins)] text-[12px] rounded-[14px] px-3.5 py-1.5 ${
                      i === 0
                        ? "bg-highlight text-primary font-bold border border-highlight"
                        : "bg-white/10 border border-white/[0.18] text-white/70"
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <LocationForm location={market.name} slug={market.slug} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-[60px]">
        <div className="container-site max-w-[780px]">
          <SectionHeader heading="Frequently Asked Questions" headingClassName="mb-8" />
          <FAQAccordion items={[...market.localFAQ]} />
        </div>
      </section>

      <section className="bg-white py-[90px]">
        <div className="container-site max-w-[1200px] text-center">
          <h2 className="text-[36px] md:text-[44px] lg:text-[56px] font-bold text-primary uppercase tracking-[0.3px] leading-[1.08] mb-3.5">
            {market.ctaHeadline}
          </h2>
          <p className="font-[family-name:var(--font-poppins)] text-[15px] md:text-[17px] text-navy/60 leading-[1.7] max-w-[560px] mx-auto mb-9">
            {market.ctaSub}
          </p>
          <ButtonLink
            href="/account/"
            className="inline-block font-bold text-[14px] uppercase tracking-[2px] py-[18px] px-[44px] rounded-[4px]"
          >
            Schedule My First Pickup
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
