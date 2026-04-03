import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { ButtonLink } from "@/components/shared/button-link";
import { FAQAccordion } from "@/components/shared/faq-accordion";

export const metadata: Metadata = {
  title: "Subscribe — Weekly Laundry Membership",
  description:
    "Subscribe to We Deliver Laundry. Weekly pickup, up to 80–120 lbs included, free delivery, 24-hour turnaround. From $139/mo. Cancel anytime.",
  openGraph: {
    title: "We Deliver Laundry — Subscribe",
    description: "Weekly laundry membership from $139/mo. Free pickup & delivery.",
    url: "https://wedeliverlaundry.com/subscribe",
  },
  alternates: {
    canonical: "https://wedeliverlaundry.com/subscribe",
  },
};

const faqs = [
  {
    question: "How does the membership work?",
    answer:
      "Pick a plan (Weekly or Family), enter your payment info, and schedule your first pickup. We come every week, wash and fold your clothes, and deliver them back within 24 hours.",
  },
  {
    question: "What happens if I go over my included weight?",
    answer:
      "No problem — extra pounds are billed at $1.95/lb. We weigh at pickup and you always know the charge before we wash.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No contracts, no cancellation fees. Cancel from your account dashboard whenever you want.",
  },
  {
    question: "What if I don't need a pickup one week?",
    answer:
      "Skip it from your dashboard up to 24 hours before your scheduled window. No charge.",
  },
];

export default function SubscribePage() {
  return (
    <>
      <section className="bg-cream py-16 lg:py-24">
        <div className="container-site max-w-[800px] text-center">
          <SectionHeader
            eyebrow="Subscribe"
            heading="Never think about laundry again"
            description="Weekly pickup, wash, fold, and delivery — all included. Plans from $139/mo."
            headingAs="h1"
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <ButtonLink href="/join">Choose Your Plan</ButtonLink>
            <ButtonLink href="/pricing" variant="outline">See All Pricing</ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-site max-w-[800px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-navy/10 bg-cream/50 p-8 text-center">
              <h3 className="font-heading-medium text-navy uppercase text-lg mb-2">Weekly</h3>
              <p className="text-3xl font-body-bold text-navy">$139<span className="text-sm font-normal text-navy/50">/mo</span></p>
              <p className="font-[family-name:var(--font-poppins)] text-xs text-primary font-body-medium mt-1">$1.74/lb · 4 pickups · 80 lbs</p>
              <div className="mt-6">
                <ButtonLink href="/join" className="w-full justify-center">Get Started</ButtonLink>
              </div>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-cream/50 p-8 text-center">
              <h3 className="font-heading-medium text-navy uppercase text-lg mb-2">Family</h3>
              <p className="text-3xl font-body-bold text-navy">$189<span className="text-sm font-normal text-navy/50">/mo</span></p>
              <p className="font-[family-name:var(--font-poppins)] text-xs text-primary font-body-medium mt-1">$1.58/lb · 4 pickups · 120 lbs</p>
              <div className="mt-6">
                <ButtonLink href="/join" className="w-full justify-center">Get Started</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-16 lg:py-20"
        style={{ background: "linear-gradient(135deg, #1227BE 0%, #050B39 100%)" }}
      >
        <div className="container-site max-w-[800px]">
          <SectionHeader
            eyebrow="FAQ"
            heading="Common questions"
            headingClassName="text-white mb-3"
            className="[&_p]:text-white/60"
          />
          <FAQAccordion items={faqs} />
        </div>
      </section>
    </>
  );
}
