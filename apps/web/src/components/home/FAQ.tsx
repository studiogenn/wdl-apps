"use client";

import type { FaqConfig } from "@/lib/section-defaults";
import { FAQAccordion, SectionHeader } from "@/components/shared";

const DEFAULT_FAQ_ITEMS = [
  {
    question: "What's the difference between the Weekly and Family plan?",
    answer:
      "The Weekly plan is $139/mo and includes 80 lbs of laundry with up to 4 weekly pickups. The Family plan is $189/mo with 120 lbs included — ideal for households with 3+ people. Both plans include free pickup and delivery with 24-hour turnaround.",
  },
  {
    question: "What happens if I go over my included pounds?",
    answer:
      "Any weight beyond your included pounds is billed at $1.95/lb. You'll see the exact weight and overage on your order summary — no surprises.",
  },
  {
    question: "Do I need a membership?",
    answer:
      "No. You can order anytime with Pay As You Go at $2.95/lb — no commitment, no monthly fee. Membership just gives you a better rate and recurring scheduled pickups.",
  },
  {
    question: "How do I schedule a pickup?",
    answer:
      "Create an account on our website or app, choose your time window, and leave your laundry at the door. Members get automatic recurring pickups on their chosen day.",
  },
  {
    question: "I don't have a laundry bag — how can I send my clothes out?",
    answer:
      "Use any bag you have — a tote, a duffel, even a garbage bag. We'll provide a reusable laundry bag with your first order.",
  },
  {
    question: "How will I know when my driver is coming?",
    answer:
      "You'll receive a notification with your driver's ETA and a live tracking link when they're on their way.",
  },
  {
    question: "Can I cancel or switch my plan?",
    answer:
      "Yes. You can switch between Weekly and Family or cancel your membership anytime from your account dashboard. No cancellation fees.",
  },
  {
    question: "What if I'm not home during my pickup window?",
    answer:
      "Just leave your laundry outside your door, in the lobby, or with your doorman. Add a note to your order so our driver knows where to find it.",
  },
];

export interface FAQProps extends FaqConfig {
  config?: FaqConfig;
}

export function FAQ({ title, heading, introText, items, config }: FAQProps) {
  const resolvedTitle =
    title ?? heading ?? config?.title ?? config?.heading ?? "Frequently Asked Questions";
  const resolvedIntroText = introText ?? config?.introText;
  const resolvedItems = items ?? config?.items ?? DEFAULT_FAQ_ITEMS;

  return (
    <section id="faq" className="py-16 lg:py-20">
      <div className="container-site max-w-[780px]">
        <SectionHeader heading={resolvedTitle} size="lg" />
        {resolvedIntroText ? (
          <p className="font-[family-name:var(--font-poppins)] text-center text-sm text-navy/60 leading-relaxed mb-10">
            {resolvedIntroText}
          </p>
        ) : null}

        <FAQAccordion items={resolvedItems} card={false} />
      </div>
    </section>
  );
}
