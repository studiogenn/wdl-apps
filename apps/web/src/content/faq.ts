export type FaqItem = {
  readonly question: string;
  readonly answer: string;
};

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "How does pickup and delivery work?",
    answer:
      "Schedule a pickup online. Our driver collects your laundry from your door, we wash and fold it professionally, and return it within 24 hours.",
  },
  {
    question: "What is the minimum order?",
    answer:
      "The minimum order is $40. There is no minimum weight requirement.",
  },
  {
    question: "How much does delivery cost?",
    answer:
      "Pickup and delivery is always free — no transport fees. You only pay per pound based on your plan.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve Manhattan, Queens, Long Island in New York, and multiple counties in New Jersey including Hudson, Bergen, Essex, Morris, Union, Passaic, and Middlesex counties.",
  },
  {
    question: "Can I cancel my weekly plan?",
    answer:
      "Yes, you can cancel anytime. There is no commitment or contract.",
  },
  {
    question: "What detergents do you use?",
    answer:
      "We use safe, professional-grade laundry soaps and detergents. If you have preferences or allergies, let us know and we will accommodate.",
  },
  {
    question: "How do I track my order?",
    answer:
      "You will receive notifications when your delivery is due. You can also track your order through your account on our website.",
  },
] as const;
