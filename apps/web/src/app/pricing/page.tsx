import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { ButtonLink } from "@/components/shared/button-link";

export const metadata: Metadata = {
  title: "Pricing — Laundry Pickup & Delivery Plans",
  description:
    "Laundry membership plans from $139/mo or Instant orders at $2.95/lb. Free pickup and delivery in NYC & New Jersey. No contracts, cancel anytime.",
  openGraph: {
    title: "We Deliver Laundry — Pricing",
    description:
      "Membership plans from $139/mo or Instant at $2.95/lb. Free pickup and delivery in NYC & NJ.",
    url: "https://wedeliverlaundry.com/pricing",
  },
  alternates: {
    canonical: "https://wedeliverlaundry.com/pricing",
  },
};

const CHECK = (
  <svg className="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 512 512" fill="currentColor">
    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
  </svg>
);

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="container-site max-w-[1100px] text-center">
          <SectionHeader
            eyebrow="Pricing"
            heading="Simple, transparent pricing"
            description="Membership or Instant — free pickup & delivery either way. No hidden fees."
            headingAs="h1"
          />
        </div>
      </section>

      {/* Membership tiers */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-site max-w-[900px]">
          <SectionHeader
            eyebrow="Membership"
            heading="Weekly laundry, handled"
            description="Set it and forget it. We pick up, wash, fold, and deliver — every week."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[720px] mx-auto">
            {[
              {
                name: "Weekly",
                price: "$139",
                rate: "$1.74/lb",
                savings: "Save 41% vs Instant",
                badge: "Most Popular",
                perks: ["4 pickups per month", "Up to 80 lbs included", "24-hour turnaround", "$1.95/lb overage", "Cancel anytime"],
              },
              {
                name: "Family",
                price: "$189",
                rate: "$1.58/lb",
                savings: "Save 46% vs Instant",
                badge: "Best Value",
                perks: ["4 pickups per month", "Up to 120 lbs included", "24-hour turnaround", "$1.95/lb overage", "Family Sort + Hypoallergenic"],
              },
            ].map((plan) => (
              <div key={plan.name} className="rounded-2xl border border-navy/10 bg-white p-8 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading-medium text-navy uppercase text-lg">{plan.name}</h3>
                    <p className="font-[family-name:var(--font-poppins)] text-xs text-primary font-body-medium mt-0.5">
                      {plan.rate} · {plan.savings}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-body-bold text-navy">{plan.price}</span>
                    <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/50">/mo</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
                      {CHECK} {perk}
                    </li>
                  ))}
                </ul>
                <ButtonLink href="/join" className="w-full justify-center">
                  Join {plan.name}
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instant */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[900px]">
          <SectionHeader
            eyebrow="Instant"
            heading="One-time pickup"
            description="No membership, no commitment. Schedule when you need it."
          />
          <div className="max-w-[480px] mx-auto rounded-2xl border border-navy/10 bg-white p-8 text-center">
            <span className="text-3xl font-body-bold text-navy">$2.95</span>
            <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/50">/lb</span>
            <ul className="mt-6 space-y-2 text-left">
              {["Free pickup & delivery", "24-hour turnaround", "No minimum commitment", "$29.99 minimum order"].map((perk) => (
                <li key={perk} className="flex items-center gap-2 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
                  {CHECK} {perk}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href="/order" variant="outline" className="w-full justify-center">
                Order Instant Pickup
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-site max-w-[900px]">
          <SectionHeader
            eyebrow="Add-ons"
            heading="Extras when you need them"
            description="Available with any membership pickup or Instant order. Priced at pickup — we text a quote before charging."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[720px] mx-auto">
            {[
              { emoji: "✨", name: "Premium Care", price: "From $5", desc: "Gentle cycle, premium detergent, delicates handling" },
              { emoji: "🧼", name: "Deep Clean", price: "From $3", desc: "Stain treatment for heavily soiled items" },
              { emoji: "🛏️", name: "Bedding", price: "$29", desc: "Sheets, pillowcases, duvet cover" },
            ].map((addon) => (
              <div key={addon.name} className="rounded-2xl border border-navy/10 bg-cream/50 p-6 text-center">
                <span className="text-2xl">{addon.emoji}</span>
                <h3 className="font-heading-medium text-navy uppercase text-sm mt-3">{addon.name}</h3>
                <p className="font-[family-name:var(--font-poppins)] text-lg font-body-bold text-navy mt-1">{addon.price}</p>
                <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50 mt-2">{addon.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
