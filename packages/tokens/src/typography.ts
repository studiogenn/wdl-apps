export const fontFamily = {
  heading: ["ZillaSlab", "Zilla Slab", "serif"],
  "heading-medium": ["ZillaSlab-Medium", "Zilla Slab", "serif"],
  "heading-bold": ["ZillaSlab-Bold", "Zilla Slab", "serif"],
  body: ["DMSans", "DM Sans", "sans-serif"],
  "body-light": ["DMSans-Light", "DM Sans", "sans-serif"],
  "body-medium": ["DMSans-Medium", "DM Sans", "sans-serif"],
  "body-bold": ["DMSans-Bold", "DM Sans", "sans-serif"],
} as const;

// Tailwind fontSize entries: [size, { lineHeight, letterSpacing, fontWeight }]
export const fontSize = {
  // Metrics (DM Sans Regular) — large display numbers
  "metric-l": ["48px", { lineHeight: "130%", letterSpacing: "-0.03em" }],
  "metric-m": ["40px", { lineHeight: "130%", letterSpacing: "-0.03em" }],

  // Headline (Zilla Slab Regular, ALL CAPS)
  "headline-m": ["42px", { lineHeight: "130%", letterSpacing: "0.02em" }],
  "headline-s": ["28px", { lineHeight: "130%", letterSpacing: "0.02em" }],

  // Subhead (Zilla Slab Medium)
  "subhead-m": ["32px", { lineHeight: "130%", letterSpacing: "0" }],
  "subhead-s": ["24px", { lineHeight: "100%", letterSpacing: "0" }],

  // Price (DM Sans Medium)
  "price-s": ["28px", { lineHeight: "130%", letterSpacing: "0" }],

  // Body (DM Sans Light)
  "body-l": ["24px", { lineHeight: "150%", letterSpacing: "-0.03em" }],
  "body-m": ["18px", { lineHeight: "150%", letterSpacing: "-0.03em" }],
  "body-s": ["16px", { lineHeight: "150%", letterSpacing: "-0.03em" }],
  "body-xs": ["14px", { lineHeight: "150%", letterSpacing: "-0.03em" }],

  // Body Bold (DM Sans Medium) — same sizes as body, heavier weight
  "body-bold-l": ["24px", { lineHeight: "150%", letterSpacing: "-0.03em" }],
  "body-bold-m": ["18px", { lineHeight: "150%", letterSpacing: "-0.03em" }],
  "body-bold-s": ["16px", { lineHeight: "150%", letterSpacing: "-0.03em" }],
  "body-bold-xs": ["14px", { lineHeight: "150%", letterSpacing: "-0.03em" }],

  // CTA (Zilla Slab Medium, ALL CAPS)
  "cta-m": ["20px", { lineHeight: "150%", letterSpacing: "0.06em" }],

  // Subtext (DM Sans Medium, ALL CAPS)
  "subtext-m": ["20px", { lineHeight: "150%", letterSpacing: "0.06em" }],
  "subtext-s": ["16px", { lineHeight: "150%", letterSpacing: "0.06em" }],
  "subtext-xs": ["10px", { lineHeight: "150%", letterSpacing: "0.06em" }],
} as const;

export const letterSpacing = {
  tight: "-0.03em",
  normal: "0",
  headline: "0.02em",
  cta: "0.06em",
} as const;

// Maps type scale names to their intended font family + weight for reference.
// Not consumed by Tailwind directly — use for documentation and component defaults.
export const typeScale = {
  metric:   { family: "body",    weight: 400, transform: "none" },
  headline: { family: "heading", weight: 400, transform: "uppercase" },
  subhead:  { family: "heading", weight: 500, transform: "none" },
  price:    { family: "body",    weight: 500, transform: "none" },
  body:     { family: "body",    weight: 300, transform: "none" },
  bodyBold: { family: "body",    weight: 500, transform: "none" },
  cta:      { family: "heading", weight: 500, transform: "uppercase" },
  subtext:  { family: "body",    weight: 500, transform: "uppercase" },
} as const;
