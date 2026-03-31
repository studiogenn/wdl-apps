import { FAQAccordion } from "@/components/shared/faq-accordion";

interface AreaFAQProps {
  readonly faqs: ReadonlyArray<{
    readonly question: string;
    readonly answer: string;
  }>;
}

export function AreaFAQ({ faqs }: AreaFAQProps) {
  return <FAQAccordion items={faqs} />;
}
