# We Deliver Laundry - Customer-Facing Website

Marketing and booking site for We Deliver Laundry. Next.js 16 (App Router) deployed on Vercel.

## Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4 + HeroUI components
- **Content**: MDX blog posts via next-mdx-remote
- **Analytics**: PostHog (feature flags + events), Google Analytics, Facebook Pixel
- **Integrations**: CleanCloud (booking/orders), Mapbox (service area search)
- **Testing**: Vitest (unit) + Playwright (E2E)

## SEO Metadata Integration

Pages pull SEO metadata from the Behemouth API at render time (ISR with 60s revalidation):

```typescript
// src/app/page.tsx
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/");  // Fetches from /public/seo/metadata?path=/
}
```

**How it works:**
1. Editor configures metadata at `/crm/seo` → Editor tab in the dashboard
2. Click "Publish" to make it live
3. Site fetches via `GET /public/seo/metadata?path={page_path}` (no auth)
4. If no metadata found, falls back to root layout defaults

**Pages with CMS metadata enabled:**
- `/` (home page)
- `/laundry-services`
- `/wash-fold`
- `/commercial-laundry`
- `/service-areas`

To add more pages, create a layout.tsx with `generateMetadata()` calling `getSeoMetadata(path)`.

## Environment Variables

```bash
# Behemouth API for SEO metadata
BEHEMOUTH_API_URL=https://arkad.studio/api  # Production
# BEHEMOUTH_API_URL=http://localhost:8000  # Local dev

# CleanCloud booking API
CLEANCLOUD_API_KEY=...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_GA_ID=...
NEXT_PUBLIC_FB_PIXEL_ID=...
POSTHOG_PERSONAL_API_KEY=...  # Server-side PostHog

# Supabase (if used)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Development

```bash
npm install
npm run dev  # http://localhost:3000
```

## Testing

```bash
npm run test           # Unit tests (Vitest)
npm run test:watch     # Watch mode
npm run test:e2e       # E2E tests (Playwright)
```

## Deployment

Deployed to Vercel. Point Vercel's **Root Directory** to `site/` in the monorepo settings.

**Build settings:**
- Framework: Next.js
- Root Directory: `site`
- Build Command: `npm run build`
- Output Directory: `.next` (default)

Set all environment variables in Vercel dashboard.
