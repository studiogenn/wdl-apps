export const BRAND = {
  colors: {
    primary: "#060B36",
    accent: "#F5E6A3",
    white: "#FFFFFF",
    dark: "#1a1a2e",
  },
} as const;

export const COMPANY = {
  name: "We Deliver Laundry",
  tagline: "Within 24 Hours",
  phone: "855-968-5511",
  email: "hello@wedeliverlaundry.com",
  address: "1351 Queen Anne Rd, Teaneck, NJ 07666",
  website: "https://wedeliverlaundry.com",
  social: {
    instagram: "https://instagram.com/wedeliverlaundry",
    facebook: "https://facebook.com/wedeliverlaundry",
  },
} as const;

export const NAV_LINKS = [
  { label: "Services & Pricing", href: "/services-pricing" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Locations", href: "/locations" },
  { label: "Business & Corporate", href: "/commercial" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: "Who We Are", href: "/who-we-are" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  programs: [
    { label: "Refer a Friend", href: "/refer-a-friend" },
    { label: "Affiliate Partners", href: "/affiliates" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
} as const;
