"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { FAQ_ITEMS } from "@/content/faq";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-center text-3xl font-bold text-wdl-dark sm:text-4xl">
            Frequently Asked Questions
          </h1>

          <Accordion.Root type="single" collapsible className="mt-12">
            {FAQ_ITEMS.map((item, i) => (
              <Accordion.Item
                key={i}
                value={`item-${i}`}
                className="border-b border-gray-200"
              >
                <Accordion.Trigger className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-wdl-dark hover:text-wdl-primary">
                  {item.question}
                  <span className="ml-4 text-wdl-primary">+</span>
                </Accordion.Trigger>
                <Accordion.Content className="pb-4 text-gray-600">
                  {item.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>
    </>
  );
}
