"use client";

import { useState } from "react";
import type { FaqConfig } from "@/lib/section-defaults";

const DEFAULT_FAQ_ITEMS = [
  {
    question: "How can I place my order?",
    answer:
      'You may place your order on this website by clicking on "Start Service Now" and following the prompts, downloading our We Deliver Laundry app, or simply texting us at (855) 968-5511.',
  },
  {
    question: "I don't have a laundry bag - how can I send my clothes out?",
    answer:
      "You may use any bag you have handy - a tote, a picnic bag, even a garbage bag! We'll provide a laundry bag with your first order for future use.",
  },
  {
    question: "How do I know when you're on your way?",
    answer:
      "Once you're our next stop, you'll receive a notification with our driver's ETA and a link to track their progress straight to your door.",
  },
  {
    question: "How do I know my laundry is being taken care of?",
    answer:
      "You receive notifications every step of the way from start to finish - from when we pick up your laundry to when we deliver it back to you.",
  },
  {
    question: "I live in a walk-up, do I have to come downstairs?",
    answer:
      "Only if you want to. As long as we have entry into the building and access to your door, we'll come right up.",
  },
  {
    question:
      "I won't be home during the time window but I'd still like to get my order picked up - what can I do?",
    answer:
      "You may leave your laundry outside your door, in the lobby, or with security/reception if you're comfortable. Please ensure we know where to find it by adding a note to your order.",
  },
  {
    question:
      "My order is scheduled for tonight but I had a change of plans, how can I reschedule?",
    answer:
      "You may cancel your order through our website and/or app up to one (1) hour before your time slot.",
  },
  {
    question:
      "What happens if I forget to cancel my order and I'm not home?",
    answer:
      'A 9.95% "Nothing to Pickup Fee" will be charged to your account. Please reach out to us to reschedule.',
  },
];

export interface FAQProps extends FaqConfig {
  config?: FaqConfig;
}

export function FAQ({ title, heading, introText, items, config }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const resolvedTitle =
    title ?? heading ?? config?.title ?? config?.heading ?? "Frequently Asked Questions";
  const resolvedIntroText = introText ?? config?.introText;
  const resolvedItems = items ?? config?.items ?? DEFAULT_FAQ_ITEMS;

  return (
    <section id="faq" className="py-16 lg:py-20">
      <div className="container-site max-w-[780px]">
        <h2 className="text-center text-[2rem] lg:text-[2.625rem] font-medium text-navy mb-10 uppercase">
          {resolvedTitle}
        </h2>
        {resolvedIntroText ? (
          <p className="font-[family-name:var(--font-poppins)] text-center text-sm text-navy/60 leading-relaxed mb-10">
            {resolvedIntroText}
          </p>
        ) : null}

        <div className="space-y-0">
          {resolvedItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border-b border-navy/10"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="font-[family-name:var(--font-poppins)] text-[15px] font-medium text-navy pr-6">
                    {item.question}
                  </span>
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center text-navy/40 group-hover:text-navy transition-colors">
                    {isOpen ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="0" y1="7" x2="14" y2="7" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="7" y1="0" x2="7" y2="14" />
                        <line x1="0" y1="7" x2="14" y2="7" />
                      </svg>
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-5">
                    <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
