"use client";

import { useState } from "react";

export interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

interface FAQAccordionProps {
  readonly items: readonly FAQItem[];
  readonly card?: boolean;
  readonly className?: string;
}

export function FAQAccordion({ items, card = true, className }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const content = items.map((item, index) => {
    const isOpen = openIndex === index;
    return (
      <div key={index} className="border-b border-navy/10 last:border-b-0">
        <button
          onClick={() => setOpenIndex(isOpen ? null : index)}
          className="w-full flex items-center justify-between py-5 text-left group"
        >
          <span className="font-[family-name:var(--font-poppins)] text-[15px] font-body-medium text-navy pr-6">
            {item.question}
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
              {item.answer}
            </p>
          </div>
        )}
      </div>
    );
  });

  if (card) {
    return (
      <div className={className ?? "bg-white rounded-2xl p-6 shadow-sm space-y-0"}>
        {content}
      </div>
    );
  }

  return (
    <div className={className ?? "space-y-0"}>
      {content}
    </div>
  );
}
