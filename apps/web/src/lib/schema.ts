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
    question: "How can I place my order?",
    answer:
      'You may place your order on this website by clicking on "Start Service Now" and following the prompts, downloading our We Deliver Laundry app, or simply texting us at (855) 968-5511.',
  },
  {
    question:
      "I don't have a laundry bag - how can I send my clothes out?",
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
