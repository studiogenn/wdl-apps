export const FLAG_KEYS = {
  HERO_CONTENT: "hero-content",
  HOMEPAGE_VARIANT: "homepage-variant",
  SIGNUP_FLOW: "signup-flow",
  NEW_ACCOUNT: "new-account-pages",
} as const;

export type SignupFlowVariant = "embed" | "quick" | "guided";

const VALID_SIGNUP_VARIANTS: ReadonlySet<string> = new Set(["embed", "quick", "guided"]);

export function parseSignupFlowVariant(raw: unknown): SignupFlowVariant {
  if (typeof raw === "string" && VALID_SIGNUP_VARIANTS.has(raw)) {
    return raw as SignupFlowVariant;
  }
  return "embed";
}

export type FlagKey = (typeof FLAG_KEYS)[keyof typeof FLAG_KEYS];

export type HeroContentPayload = {
  readonly headline: string;
  readonly highlightedText: string;
  readonly subheadline: string;
  readonly ctaText: string;
  readonly ctaUrl: string;
  readonly locationPrefix: string;
  readonly locationText: string;
};

export const DEFAULT_HERO_CONTENT: HeroContentPayload = {
  headline: "Laundry Pickup & Delivery",
  highlightedText: "Within 24 Hours",
  subheadline:
    "Washed, folded, and returned to your doorstep. Free delivery for weekly customers.",
  ctaText: "Schedule Pickup",
  ctaUrl: "/account",
  locationPrefix: "Serving",
  locationText: "",
};

export function parseHeroPayload(raw: unknown): HeroContentPayload {
  if (
    typeof raw === "object" &&
    raw !== null &&
    "headline" in raw &&
    "highlightedText" in raw &&
    "subheadline" in raw &&
    "ctaText" in raw &&
    "ctaUrl" in raw &&
    typeof (raw as Record<string, unknown>).headline === "string" &&
    typeof (raw as Record<string, unknown>).highlightedText === "string" &&
    typeof (raw as Record<string, unknown>).subheadline === "string" &&
    typeof (raw as Record<string, unknown>).ctaText === "string" &&
    typeof (raw as Record<string, unknown>).ctaUrl === "string"
  ) {
    const r = raw as Record<string, unknown>;
    return {
      headline: r.headline as string,
      highlightedText: r.highlightedText as string,
      subheadline: r.subheadline as string,
      ctaText: r.ctaText as string,
      ctaUrl: r.ctaUrl as string,
      locationPrefix: typeof r.locationPrefix === "string" ? r.locationPrefix : "Serving",
      locationText: typeof r.locationText === "string" ? r.locationText : "",
    };
  }
  return DEFAULT_HERO_CONTENT;
}

export type FlagPayloads = {
  readonly [key: string]: unknown;
};
