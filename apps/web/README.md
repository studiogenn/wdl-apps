# We Deliver Laundry - Customer-Facing Website

Marketing and booking site for We Deliver Laundry. Next.js 16 (App Router) deployed on Vercel.

## Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4 + HeroUI components
- **Content**: MDX blog posts via next-mdx-remote
- **Analytics**: PostHog (feature flags + events), Google Analytics, Facebook Pixel
- **Integrations**: CleanCloud (booking/orders via direct API), Mapbox (service area search)
- **Testing**: Vitest (unit) + Playwright (E2E)

## SEO Metadata Integration

Pages can pull SEO metadata from an optional CMS API at render time (ISR with 60s revalidation):

```typescript
// src/app/page.tsx
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/");  // Fetches from CMS_API_URL/public/seo/metadata?path=/
}
```

If no CMS API is configured (`CMS_API_URL` not set), pages fall back to root layout defaults.

## Environment Variables

```bash
# CleanCloud API (direct — required)
CLEANCLOUD_API_TOKEN=...

# CMS API (optional — enables SEO metadata, blog CMS, and visual editor)
CMS_API_URL=
NEXT_PUBLIC_CMS_API_URL=

# Database
DATABASE_URL=...

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_GA_ID=...
NEXT_PUBLIC_FB_PIXEL_ID=...
POSTHOG_PERSONAL_API_KEY=...  # Server-side PostHog
```

## Development

```bash
pnpm install
pnpm dev  # http://localhost:3000
```

## Testing

```bash
pnpm test           # Unit tests (Vitest)
pnpm test:watch     # Watch mode
pnpm test:e2e       # E2E tests (Playwright)
```

## Deployment

Deployed to Vercel. Push to `main` triggers auto-deploy.

Set all environment variables in Vercel dashboard.
