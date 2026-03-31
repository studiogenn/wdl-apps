# We Deliver Laundry — Website Design

**Date:** 2026-02-14
**Stack:** Next.js 15 (App Router), Tailwind CSS, Radix UI, Framer Motion, Supabase, MDX
**Hosting:** Vercel
**Status:** Approved

---

## Goals

- Equal weight on residential signups and commercial lead generation (commercial deferred to later phase)
- Replace existing WordPress site
- Strong local SEO for 30+ service area pages
- Fast, mobile-first, accessible

## Page Structure

```
/                          Homepage
/services-pricing          Services & Pricing
/how-it-works              How It Works
/locations                 Service areas hub
/locations/[slug]          Individual location pages (SSG)
/blog                      Blog index
/blog/[slug]               Individual posts (MDX)
/account                   Customer dashboard (deferred)
/signup                    Customer registration (deferred)
/login                     Customer login (deferred)
/faq                       FAQ
/terms                     Terms of Service
/contact                   Contact Us
/about                     About
```

**Deferred:** /for-businesses, /business-blog, /account, /signup, /login

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 (App Router) | Framework, SSG, server components |
| Tailwind CSS | Styling, brand tokens |
| Radix UI | Accessible unstyled primitives |
| Framer Motion | Lightweight animations |
| next-mdx-remote | MDX blog rendering |
| Supabase | Contact form submissions |
| next-sitemap | Sitemap + robots.txt generation |

## Project Structure

```
src/
├── app/                   Next.js App Router pages
│   ├── layout.tsx         Root layout (nav, footer, fonts)
│   ├── page.tsx           Homepage
│   ├── services-pricing/
│   ├── how-it-works/
│   ├── locations/
│   │   └── [slug]/
│   ├── blog/
│   │   └── [slug]/
│   ├── faq/
│   ├── terms/
│   ├── contact/
│   └── about/
├── components/
│   ├── layout/            Header, Footer, Nav, MobileMenu
│   ├── ui/                Button, Card, Input (Radix-based)
│   └── sections/          Hero, PricingCard, ProcessFlow, etc.
├── content/
│   ├── blog/              MDX blog posts
│   └── locations/         Location data (JSON)
└── lib/
    └── constants.ts       Brand colors, phone, URLs
```

## Component Architecture

### Radix UI Usage

| Component | Radix Primitive | Usage |
|-----------|----------------|-------|
| Mobile nav | Dialog | Slide-out mobile menu |
| FAQ | Accordion | Expandable Q&A items |
| Location selector | Select | Area/neighborhood picker |
| Toast notifications | Toast | Success/error feedback |
| Dropdown menu | DropdownMenu | Account menu (future) |
| Tabs | Tabs | Services/pricing toggle |

### Shared Layout

- **Header** — logo, nav links, CTA button ("Schedule Pickup")
- **Footer** — service areas, contact info (855-968-5511), social links, legal links
- **MobileMenu** — Radix Dialog, slide-in nav for mobile

### Page Sections

- **Hero** — headline, subtext, CTA, subtle Framer Motion animation
- **ProcessFlow** — 4-step visual (Pickup, Wash, Fold, Deliver)
- **PricingCard** — plan details with CTA
- **LocationCard** — area name, neighborhoods, link to detail page
- **BlogCard** — title, excerpt, date, read link
- **ContactForm** — name, email, phone, message -> Supabase
- **TestimonialCarousel** — customer quotes (Framer Motion)

## Content Strategy

### Blog Posts (MDX)

Frontmatter:
```yaml
title: "How to Remove Coconut Oil Stains"
date: "2026-02-10"
excerpt: "Quick guide to getting coconut oil out of clothes."
tags: ["stain-removal", "tips"]
```

### Location Pages (JSON -> SSG)

```json
{
  "name": "Manhattan",
  "slug": "manhattan",
  "neighborhoods": ["Chelsea", "East Village", "Midtown East"],
  "state": "NY"
}
```

### FAQ

Array of `{ question, answer }` objects in `src/content/faq.ts`. Rendered with Radix Accordion. Outputs JSON-LD FAQ schema.

### Contact Form

- Fields: name, email, phone, message
- Server action posts to Supabase
- No client-side API key exposure

## SEO

- `metadata` export on every page (title, description, OG, Twitter cards)
- JSON-LD structured data: LocalBusiness (location pages), FAQPage (FAQ), Article (blog)
- `next-sitemap` for sitemap.xml and robots.txt
- Canonical URLs on all pages
- All location pages statically generated

## Performance Targets

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- SSG for all public pages
- `next/image` for automatic WebP, lazy loading, responsive
- Tailwind CSS purged at build

## Analytics

- PostHog — product analytics
- Google Analytics — traffic
- Facebook Pixel — ad tracking

## Brand Tokens

```css
:root {
  --wdl-primary: #2B4EE8;
  --wdl-accent: #F5E6A3;
  --wdl-white: #FFFFFF;
  --wdl-text-dark: #1a1a2e;
}
```
