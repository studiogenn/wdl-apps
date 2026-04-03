/**
 * JSON-LD structured data generators for We Deliver Laundry pages.
 *
 * Each function returns a schema.org object ready for JSON-LD injection.
 * CMS-managed schema (via getSeoSchemaMarkup) takes priority over these
 * defaults — these exist as fallbacks when no CMS data is configured.
 */

const BUSINESS = {
  name: "We Deliver Laundry",
  url: "https://wedeliverlaundry.com",
  telephone: "+18559685511",
  email: "start@wedeliverlaundry.com",
  logo: "https://wedeliverlaundry.com/images/logo-white.svg",
  sameAs: [
    "https://www.instagram.com/wedeliverlaundry/",
    "https://www.facebook.com/people/We-Deliver-Laundry/61581397901196/",
  ],
} as const;

const AREA_SERVED = [
  {
    "@type": "State" as const,
    name: "New York",
  },
  {
    "@type": "State" as const,
    name: "New Jersey",
  },
];

/**
 * DryCleaningOrLaundry schema for the homepage.
 * Uses service-area business format (no street address — pickup/delivery model).
 */
export function getLocalBusinessSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "DryCleaningOrLaundry",
    name: BUSINESS.name,
    url: BUSINESS.url,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    logo: BUSINESS.logo,
    sameAs: BUSINESS.sameAs,
    priceRange: "$$",
    areaServed: AREA_SERVED,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
  };
}

/**
 * Service schema for individual service pages.
 */
export function getServiceSchema(opts: {
  readonly serviceType: string;
  readonly description: string;
  readonly url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: opts.serviceType,
    description: opts.description,
    url: opts.url,
    provider: {
      "@type": "DryCleaningOrLaundry",
      name: BUSINESS.name,
      url: BUSINESS.url,
      telephone: BUSINESS.telephone,
    },
    areaServed: AREA_SERVED,
  };
}

/**
 * FAQPage schema from an array of question/answer pairs.
 */
export function getFaqSchema(
  faqs: ReadonlyArray<{ readonly question: string; readonly answer: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// FAQ data constants — shared between schema generators and page components.
// Kept here to avoid "use client" import issues (page components are client).
// ---------------------------------------------------------------------------

export const HOME_FAQ = [
  {
    question: "What's the difference between the Weekly and Family plan?",
    answer:
      "The Weekly plan is $139/mo and includes 80 lbs of laundry across 4 weekly pickups. The Family plan is $189/mo with 120 lbs included — ideal for households with 3+ people. Both plans include free pickup and delivery with 24-hour turnaround.",
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
] as const;

export const WASH_FOLD_FAQ = [
  {
    question: "How much is the service?",
    answer:
      "We have different options depending on your lifestyle! Pay As You Go at $2.99/lb, Biweekly Plan at $2.15/lb, or Weekly Plan at $1.95/lb.",
  },
  {
    question: "How much is the delivery fee?",
    answer:
      "There is no delivery fee! We only charge per pound. $40 minimum order.",
  },
  {
    question: "Is there a limit on how much I can send?",
    answer: "No limit! Send as much as you need.",
  },
  {
    question: "Do you have discounts available?",
    answer:
      "Yes! Our Weekly Plan saves you significantly compared to Pay As You Go pricing.",
  },
] as const;

export const COMMERCIAL_FAQ = [
  {
    question: "How much is the service?",
    answer:
      "Commercial pricing is customized based on your volume and schedule. Contact us for a personalized quote.",
  },
  {
    question: "How much is the delivery fee?",
    answer:
      "There is no delivery fee for commercial accounts! We only charge based on volume.",
  },
  {
    question: "Is there a limit on how much I can send?",
    answer:
      "No limit! We handle businesses of all sizes, from small operations to high-volume accounts.",
  },
  {
    question: "Do you have discounts available?",
    answer:
      "Yes! We offer volume discounts and custom pricing for regular commercial accounts.",
  },
] as const;

export const SERVICE_AREAS_FAQ = [
  {
    question: "How can I check if you service my area?",
    answer:
      'You may check by clicking on "Check Your Zip Code" above and entering your zip code. You can also browse our service area lists for New York and New Jersey.',
  },
] as const;
