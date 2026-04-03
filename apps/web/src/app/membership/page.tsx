import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { ButtonLink } from "@/components/shared/button-link";
import { FAQAccordion } from "@/components/shared/faq-accordion";

export const metadata: Metadata = {
  title: "Membership — How Our Laundry Subscription Works",
  description:
    "Learn how We Deliver Laundry's subscription plan works. Weekly or biweekly pickup, ~15–18 lbs per bag, free delivery, 24-hour turnaround. No contracts.",
  openGraph: {
    title: "We Deliver Laundry — Membership & Subscription Plans",
    description:
      "Laundry on autopilot. Weekly or biweekly pickup, clean clothes back in 24 hours. From $30.99/bag.",
    url: "https://wedeliverlaundry.com/membership",
  },
  alternates: {
    canonical: "https://wedeliverlaundry.com/membership",
  },
};

const checkIcon = (
  <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" viewBox="0 0 512 512" fill="currentColor">
    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
  </svg>
);

const steps = [
  {
    number: "01",
    heading: "Pick your frequency",
    body: "Choose weekly or every two weeks. Tell us your preferences once — we remember everything from there.",
  },
  {
    number: "02",
    heading: "We pick up your bag",
    body: "Leave your bag at the door. Our driver collects it during your scheduled window and brings it to our facility.",
  },
  {
    number: "03",
    heading: "Clean clothes, delivered back",
    body: "Washed, dried, and neatly folded within 24 hours. We drop it back at your door — no trip to the laundromat ever again.",
  },
];

const plans = [
  {
    label: "Weekly",
    freq: "4 pickups / month",
    priceFrom: "$30.99",
    unit: "/bag",
    note: "From $30.99/bag · Best value",
    highlight: true,
    perks: [
      "Free pickup & delivery",
      "~15–18 lbs per bag",
      "24-hour turnaround",
      "Cancel anytime",
    ],
  },
  {
    label: "Biweekly",
    freq: "2 pickups / month",
    priceFrom: "$34.99",
    unit: "/bag",
    note: "$34.99/bag",
    highlight: false,
    perks: [
      "Free pickup & delivery",
      "~15–18 lbs per bag",
      "24-hour turnaround",
      "Cancel anytime",
    ],
  },
];

const addOns = [
  {
    emoji: "🧼",
    name: "Deep Clean",
    price: "$9.99/bag",
    desc: "Extra detergent pass for heavily soiled loads. Or add per item ($1.49/item) in a separate bag.",
  },
  {
    emoji: "👨‍👩‍👧",
    name: "Family Sort + Hypoallergenic",
    price: "$4.99/bag",
    desc: "Clothes sorted by person and washed with fragrance-free, hypoallergenic detergent.",
  },
  {
    emoji: "✨",
    name: "Premium Care",
    price: "$4.99/bag",
    desc: "Gentle cycle and premium detergent for delicates. No special sorting needed from you.",
  },
  {
    emoji: "🛏️",
    name: "Bedding Refresh",
    price: "$58.99/order",
    desc: "Full bedding set — sheets, pillowcases, duvet cover — washed and returned fresh.",
  },
];

const faqs = [
  {
    question: "How big is a bag?",
    answer:
      "Each bag holds roughly 15–18 lbs of laundry — that's about a week's worth of clothes for one person. If you have more, you can add a second bag to your plan.",
  },
  {
    question: "What do I do if I don't have laundry that week?",
    answer:
      "Just skip! You can skip a pickup from your account dashboard up to 24 hours before your scheduled window. No charge, no hassle.",
  },
  {
    question: "Is there a contract or commitment?",
    answer:
      "None at all. You can cancel, pause, or change your plan at any time from your account. There are no cancellation fees.",
  },
  {
    question: "What's the turnaround time?",
    answer:
      "Standard turnaround is 24 hours. We pick up today, you get it back tomorrow. Rush same-day service is available for pay-as-you-go orders.",
  },
  {
    question: "What detergent do you use?",
    answer:
      "We use Tide Free & Gentle by default — unscented and hypoallergenic. If you have a preference, note it in your account and we'll do our best to accommodate.",
  },
  {
    question: "Can I add a second bag later?",
    answer:
      "Yes. You can add or remove bags from your plan at any time. Pricing adjusts automatically — 2+ bags/week drops to $30.99/bag.",
  },
];

export default function MembershipPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <p className="text-sm uppercase tracking-[0.15em] font-[family-name:var(--font-poppins)] font-body-medium text-navy/50 mb-3">
                Membership
              </p>
              <h1 className="font-heading-medium text-navy uppercase text-[2.25rem] lg:text-[3rem] mb-5 leading-tight">
                Laundry on autopilot
              </h1>
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed mb-8 max-w-lg">
                Set up a weekly or biweekly pickup and never think about laundry again. We
                pick up, wash, fold, and deliver back to your door — all within 24 hours.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Free pickup & delivery, always",
                  "No contracts — cancel anytime",
                  "~15–18 lbs per bag",
                  "24-hour turnaround",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-[family-name:var(--font-poppins)] text-[15px] text-navy/80">
                    {checkIcon}
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/pricing">Build your plan</ButtonLink>
                <ButtonLink href="/wash-fold" variant="outline">See all pricing</ButtonLink>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 uppercase tracking-widest mb-6 text-center">
                  Starting from
                </p>
                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className="text-[3.5rem] font-body-bold text-navy leading-none">$30.99</span>
                  <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/60 mb-2">/bag</span>
                </div>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 text-center mb-8">
                  Weekly plan · 2+ bags
                </p>
                <div className="border-t border-navy/10 pt-6 space-y-3">
                  {[
                    ["Weekly", "from $30.99/bag"],
                    ["Biweekly", "from $34.99/bag"],
                  ].map(([label, price]) => (
                    <div key={label} className="flex justify-between font-[family-name:var(--font-poppins)] text-sm">
                      <span className="text-navy/70">{label}</span>
                      <span className="font-body-medium text-navy">{price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <SectionHeader
            eyebrow="How It Works"
            heading="Three steps. Then you're done."
            description="Signing up takes two minutes. After that, laundry just happens."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="bg-cream rounded-2xl p-8">
                <span className="inline-block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-primary uppercase tracking-widest mb-4">
                  Step {step.number}
                </span>
                <h3 className="font-heading-medium text-navy uppercase text-[1.15rem] mb-3">
                  {step.heading}
                </h3>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plan Options ─────────────────────────────────────── */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <SectionHeader
            eyebrow="Plans"
            heading="Pick your frequency"
            description="All plans include free pickup and delivery. No hidden fees, no delivery charges — just a flat per-bag rate."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[720px] mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.label}
                className={`relative bg-white rounded-2xl p-8 flex flex-col ${plan.highlight ? "border-2 border-primary shadow-sm" : "border border-navy/10"}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-[family-name:var(--font-poppins)] font-body-medium px-3 py-1 rounded-full">
                    Best Value
                  </span>
                )}
                <h3 className="font-heading-medium text-navy uppercase text-lg mb-1">
                  {plan.label}
                </h3>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 mb-5">
                  {plan.freq}
                </p>
                <div className="mb-6">
                  <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/50">from </span>
                  <span className="text-[2.5rem] font-body-bold text-navy">{plan.priceFrom}</span>
                  <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">{plan.unit}</span>
                </div>
                <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 space-y-3 mb-8 flex-1">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      {checkIcon}
                      {perk}
                    </li>
                  ))}
                </ul>
                <ButtonLink href="/pricing" variant={plan.highlight ? "primary" : "outline"} className="w-full justify-center">
                  Get started
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's In Your Bag ───────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="flex-1">
              <SectionHeader
                eyebrow="What's Included"
                heading="Everything in your bag, handled"
                align="left"
                headingClassName="mb-4"
              />
              <p className="font-[family-name:var(--font-poppins)] text-[15px] text-navy/70 leading-relaxed mb-6">
                Each bag holds roughly 15–18 lbs — about a week&apos;s worth of everyday clothes for one person.
                We wash, dry, and fold everything neatly. You never need to sort or separate anything.
              </p>
              <ul className="space-y-3">
                {[
                  "Everyday clothing — shirts, pants, underwear, socks",
                  "Workout clothes and activewear",
                  "Towels and washcloths",
                  "Light jackets and hoodies",
                  "Baby clothes and kids' clothing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-[family-name:var(--font-poppins)] text-[15px] text-navy/80">
                    {checkIcon}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-light-blue rounded-2xl p-8">
                <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy uppercase tracking-widest mb-6">
                  Good to know
                </p>
                <div className="space-y-5">
                  {[
                    ["Minimum order", "$40 (roughly 15 lbs)"],
                    ["Turnaround", "24 hours"],
                    ["Default detergent", "Tide Free & Gentle"],
                    ["Folding", "Neatly folded, every time"],
                    ["Bedding", "Add-on available separately"],
                    ["Dry cleaning", "Not included — wash & fold only"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-start gap-4 border-b border-navy/10 pb-4 last:border-0 last:pb-0">
                      <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">{label}</span>
                      <span className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Add-Ons ──────────────────────────────────────────── */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <SectionHeader
            eyebrow="Add-Ons"
            heading="Upgrade your wash"
            description="All add-ons are optional and can be added when you build your plan."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addOns.map((addon) => (
              <div key={addon.name} className="bg-white rounded-2xl p-6 flex gap-4 items-start">
                <span className="text-2xl mt-0.5">{addon.emoji}</span>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-heading-medium text-navy uppercase text-[1rem]">
                      {addon.name}
                    </h3>
                    <span className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-primary">
                      {addon.price}
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                    {addon.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section
        className="py-16 lg:py-20"
        style={{ background: "linear-gradient(135deg, #1227BE 0%, #050B39 100%)" }}
      >
        <div className="container-site max-w-[1100px]">
          <SectionHeader
            eyebrow="FAQ"
            heading="Common questions"
            headingClassName="text-white mb-3"
            className="[&_p]:text-white/60"
          />
          <FAQAccordion items={faqs} />
          <div className="text-center mt-12">
            <ButtonLink href="/pricing" className="bg-white text-navy hover:bg-white/90">
              Build your plan
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
