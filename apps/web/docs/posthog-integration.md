# PostHog Integration

How PostHog is wired into the WDL site for analytics, feature flags, and A/B testing.

## Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_POSTHOG_KEY` | Client + Server | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Client + Server | API host (defaults to `https://us.i.posthog.com`) |
| `POSTHOG_PERSONAL_API_KEY` | Server only | Personal API key for server-side flag evaluation |

All three are required for full functionality. Without them, tracking and flags silently degrade.

## Architecture

```
Request
  │
  ▼
┌────────────────────────────────────────────────────────┐
│ Middleware (src/middleware.ts)                          │
│                                                        │
│  1. Read visitor ID (ab_visitor_id from CF worker, or   │
│     generate one for direct Vercel access)              │
│  2. Read geo headers from Vercel (city, region, country│
│  3. Match visitor to a service location (src/lib/geo)  │
│  4. Call posthog.getAllFlags() with person properties   │
│  5. Fetch flag payloads for each active flag            │
│  6. If homepage-variant flag → rewrite / to variant URL │
│  7. Set x-wdl-* response headers with all data         │
└───────────────────────┬────────────────────────────────┘
                        │ headers
                        ▼
┌────────────────────────────────────────────────────────┐
│ Root Layout (src/app/layout.tsx)                       │
│                                                        │
│  1. Read x-wdl-flags and x-wdl-flag-payloads headers  │
│  2. Parse JSON                                         │
│  3. Pass to <PostHogProvider> as bootstrap data        │
└───────────────────────┬────────────────────────────────┘
                        │ props
                        ▼
┌────────────────────────────────────────────────────────┐
│ PostHogProvider (src/components/analytics/posthog-     │
│                  provider.tsx)                          │
│                                                        │
│  1. Initialize posthog-js with bootstrap:              │
│     - distinctID (visitor ID from middleware)           │
│     - featureFlags (evaluated flags)                   │
│     - featureFlagPayloads (flag JSON payloads)         │
│  2. Auto-pageview disabled; CF worker fires first       │
│     pageview after variant tagging. SPA navigations     │
│     handled by PostHogPageviewTracker component.        │
│  3. Wraps app in posthog-js/react provider             │
└────────────────────────────────────────────────────────┘
```

The bootstrap pattern means flags are available instantly on the client without a separate network request — no flicker or race conditions.

## Key Files

| File | Role |
|------|------|
| `src/middleware.ts` | Server-side flag evaluation, visitor ID, geo, variant routing |
| `src/lib/posthog-server.ts` | Singleton PostHog Node client (lazy init) |
| `src/components/analytics/posthog-provider.tsx` | Client-side initialization with bootstrap |
| `src/lib/feature-flags.ts` | Flag key constants, payload types, and parsing |
| `src/lib/tracking.ts` | Typed event tracking helpers |
| `src/app/layout.tsx` | Reads middleware headers, passes to provider |

## Feature Flags

### `hero-content`

Payload-based flag. The payload is a JSON object that customizes the hero section:

```json
{
  "headline": "Laundry Pickup & Delivery",
  "highlightedText": "Within 24 Hours",
  "subheadline": "Washed, folded, and returned to your doorstep.",
  "ctaText": "Schedule Pickup",
  "ctaUrl": "https://wedeliverlaundry.com/my-account/"
}
```

Consumed in `src/app/page.tsx` via `parseHeroPayload()` which validates the shape and falls back to `DEFAULT_HERO_CONTENT` if invalid.

### `homepage-variant`

String flag. When set to a value like `"b"`, middleware rewrites `/` to `/variants/homepage-b`. Variant pages live at `src/app/variants/homepage-{variant}/page.tsx`.

## Person Properties Sent to PostHog

Middleware sends these with every flag evaluation:

| Property | Source | Example |
|----------|--------|---------|
| `city` | `x-vercel-ip-city` header | `"Teaneck"` |
| `region` | `x-vercel-ip-country-region` header | `"NJ"` |
| `country` | `x-vercel-ip-country` header | `"US"` |
| `matched_location` | Geo resolution against location database | `"teaneck-nj"` |
| `is_returning` | Whether `ab_visitor_id` or `wdl_visitor_id` cookie existed | `"true"` / `"false"` |

These can be used in PostHog to target flags by location or new vs returning visitors.

## Event Tracking

Events are fired client-side via `src/lib/tracking.ts`:

| Event | Helper | Used In |
|-------|--------|---------|
| `schedule_pickup_click` | `trackSchedulePickupClick(source)` | Hero CTA, Final CTA |
| `contact_form_submit` | `trackContactFormSubmit()` | Contact page |
| `cta_click` | `trackCtaClick(text, source)` | Generic CTA clicks |
| `phone_click` | `trackPhoneClick(source)` | Phone number links |

All tracking calls are wrapped in try/catch — if PostHog isn't initialized (e.g. missing env vars, ad blocker), they silently no-op.

## Response Headers

Middleware sets these on every response for downstream consumption:

| Header | Content |
|--------|---------|
| `x-wdl-visitor-id` | UUID visitor identifier |
| `x-wdl-geo-city` | Visitor's city |
| `x-wdl-geo-region` | Visitor's state/region |
| `x-wdl-geo-country` | Visitor's country code |
| `x-wdl-matched-location` | Matched WDL service area slug (or empty) |
| `x-wdl-flags` | JSON of all evaluated feature flags |
| `x-wdl-flag-payloads` | JSON of all flag payloads |

## Visitor Identity

- Primary identity: `ab_visitor_id` cookie, set by the Cloudflare A/B test worker at the edge
- Fallback: if `ab_visitor_id` is missing (direct Vercel access), middleware reads legacy `wdl_visitor_id` or generates a new UUID
- The same ID is used as `distinctID` for both server-side flag evaluation and client-side tracking, ensuring a consistent identity across the CF worker, server SDK, and client SDK

## Failure Modes

| Scenario | Behavior |
|----------|----------|
| Missing env vars | `getPostHogServer()` throws; middleware catches and continues with empty flags |
| PostHog API down | `getAllFlags()` fails; middleware catches and continues with defaults |
| Ad blocker blocks posthog-js | Client-side tracking no-ops; flags still work via server-side bootstrap |
| No Vercel geo headers (local dev) | Geo fields are empty strings; flag evaluation works but geo-targeting won't match |
