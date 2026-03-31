/**
 * Default config values for each section type.
 * Used when a section is added in the CMS but no config is set yet.
 */

export interface HeroConfig {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bulletPoints?: string[];
  heroImage?: string;
}

export interface ServicesConfig {
  title?: string;
  heading?: string;
  subheading?: string;
  showPricing?: boolean;
}

export interface FaqConfig {
  title?: string;
  heading?: string;
  introText?: string;
  items?: Array<{ question: string; answer: string }>;
}

export interface CtaConfig {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export interface HowItWorksConfig {
  heading?: string;
  subheading?: string;
  eyebrow?: string;
}

export interface TestimonialsConfig {
  heading?: string;
  subheading?: string;
  eyebrow?: string;
}

export interface TrustedBrandsConfig {
  heading?: string;
}

export interface ByTheNumbersConfig {
  heading?: string;
  subheading?: string;
  eyebrow?: string;
}

/* ── Layout primitives ── */

export interface ContainerConfig {
  maxWidth: 'full' | 'wide' | 'default' | 'narrow';
  paddingY: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  paddingX: 'none' | 'sm' | 'md' | 'lg';
  backgroundColor: string;
}

export interface ColumnsConfig {
  columns: 2 | 3 | 4;
  gap: 'sm' | 'md' | 'lg';
  verticalAlign: 'top' | 'center' | 'bottom';
  stackOnMobile: boolean;
}

export interface SpacerConfig {
  height: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export interface TextBlockConfig {
  content: string;
  fontSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  color: string;
}

export interface ButtonConfig {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  align: 'left' | 'center' | 'right';
  fullWidth: boolean;
}

export interface ImageSectionConfig {
  src?: string;
  alt?: string;
  aspectRatio?: 'auto' | '16:9' | '4:3' | '21:9';
  maxWidth?: 'full' | 'container' | 'narrow';
  caption?: string;
}

export type SectionConfig =
  | HeroConfig
  | ServicesConfig
  | FaqConfig
  | CtaConfig
  | HowItWorksConfig
  | TestimonialsConfig
  | TrustedBrandsConfig
  | ByTheNumbersConfig
  | ContainerConfig
  | ColumnsConfig
  | SpacerConfig
  | TextBlockConfig
  | ButtonConfig
  | ImageSectionConfig;

export const SECTION_DEFAULTS: Record<string, SectionConfig> = {
  hero: {
    heading: "Laundry Pickup & Delivery in NYC & New Jersey",
    subheading:
      "Schedule a pickup, and get your clothes professionally washed, folded, and returned within 24 hours.",
    ctaText: "Schedule Pick-up",
    ctaLink: "/account/",
    secondaryCtaText: "Check Your Zip Code",
    secondaryCtaLink: "/account/",
    bulletPoints: [
      "24-Hour Turnaround",
      "Reliable Delivery Service",
      "No Harsh Chemicals",
    ],
  },
  services: {
    title: "Laundry Services for Every Need in NYC & New Jersey",
    heading: "Laundry Services for Every Need in NYC & New Jersey",
    subheading:
      "From everyday wash & fold to professional dry cleaning and commercial laundry services — We Deliver Laundry takes care of it all, so you don't have to.",
    showPricing: true,
  },
  faq: {
    title: "Frequently Asked Questions",
    heading: "Frequently Asked Questions",
  },
  cta: {
    heading: "Ready to Get Started?",
    subheading:
      "From easy scheduling to reliable 24-hour delivery, we've built a laundry service that fits into your life instead of taking over it.",
    ctaText: "Schedule Pick-up",
    ctaLink: "/account/",
    secondaryCtaText: "View Pricing",
    secondaryCtaLink: "/wash-fold",
  },
  how_it_works: {
    heading: "Laundry Pickup & Drop-Off, Explained",
    subheading:
      "From pickup to drop-off, We Deliver Laundry makes laundry pickup and delivery easy, reliable, and painless — so you can focus on what matters most.",
    eyebrow: "How it Works",
  },
  testimonials: {
    heading: "A Word From Our Customers",
    subheading:
      "Straight from customers who rely on We Deliver Laundry every week for fast, reliable laundry pickup and delivery across NYC and New Jersey.",
    eyebrow: "Client Testimonials",
  },
  trusted_brands: {
    heading: "Trusted by Brands Across the City",
  },
  by_the_numbers: {
    heading: "Proven Laundry Pickup & Delivery You Can Trust",
    subheading:
      "We don't love bragging, but the numbers speak for themselves. Fast turnaround times, thousands of happy customers, and mountains of laundry cleaned and delivered across New York City and New Jersey.",
    eyebrow: "By The Numbers",
  },
  image_section: {
    src: '',
    alt: '',
    aspectRatio: 'auto',
    maxWidth: 'container',
    caption: '',
  },
};
