"use client";

import { useState } from "react";

interface AreaFAQProps {
  readonly faqs: ReadonlyArray<{
    readonly question: string;
    readonly answer: string;
  }>;
}

export function AreaFAQ({ faqs }: AreaFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const isLast = index === faqs.length - 1;

        return (
          <div key={index} className={isLast ? "" : "border-b border-navy/10"}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between py-5 text-left group"
            >
              <span className="font-[family-name:var(--font-poppins)] text-[15px] font-medium text-navy pr-6">
                {faq.question}
              </span>
              <span className="shrink-0 w-6 h-6 flex items-center justify-center text-navy/40 group-hover:text-navy transition-colors">
                {isOpen ? (
                  <svg width="14" height="2" viewBox="0 0 14 2" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="0" y1="1" x2="14" y2="1" />
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
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
