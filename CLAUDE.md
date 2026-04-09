# WDL Apps

Monorepo for We Deliver Laundry — website and mobile app (Expo / React Native).

## Structure

| Path | What | Stack |
|------|------|-------|
| `apps/web` | Marketing site + API backend | Next.js 16, Vercel, Tailwind 4 |
| `apps/mobile` | Customer mobile app | Expo 55, React Native, NativeWind |
| `packages/tokens` | Shared design tokens (colors, typography, spacing) | Tailwind preset |
| `packages/api` | Shared API types (WIP) | TypeScript |
| `packages/ui` | Shared UI components (WIP) | React |

## Auth

Better Auth with email/password. Server config at `apps/web/src/lib/auth.ts`, client at `apps/web/src/lib/auth-client.ts` (web) and `apps/mobile/lib/auth/client.ts` (mobile). Sessions stored in Postgres. Mobile uses `expo-secure-store` for token persistence.

## Database

PostgreSQL via Drizzle ORM. Schema definitions in `apps/web/src/lib/db/schema.ts`. Connection goes through PgBouncer in transaction mode (`prepare: false` required).

Schema changes should be coordinated carefully — the `leads`, `user`, `session`, `account`, `verification`, `user_preferences`, and `push_tokens` tables are in the public schema. Stripe tables (`customers`, `subscriptions`, `payments`, `invoices`, `subscription_events`) are in the `stripe_wdl` schema.

## CleanCloud

CleanCloud is the current POS system for orders, customers, routing, and scheduling. The API client at `apps/web/src/lib/cleancloud/client.ts` calls CleanCloud's API directly at `https://cleancloudapp.com/api` using the `CLEANCLOUD_API_TOKEN` env var.

All CleanCloud API calls go through Next.js API routes at `apps/web/src/app/api/cleancloud/`. The mobile app calls these routes, not CleanCloud directly.

Goal: migrate off CleanCloud entirely. Customer auth already owned. CleanCloud customer IDs stored on the Better Auth user record (`cleancloudCustomerId` field).

## CMS / Visual Editor (Optional)

The site supports an optional CMS API for SEO metadata, blog posts, and a Puck visual editor. Configured via `CMS_API_URL` / `NEXT_PUBLIC_CMS_API_URL` env vars. When not configured, SEO falls back to layout defaults and blog falls back to local MDX files in `src/content/blog/`.

## Feature Flags

PostHog feature flags. Keys defined in `apps/web/src/lib/feature-flags.ts`. Evaluated server-side in middleware and bootstrapped to client. PostHog proxied through `/ingest/*` to avoid ad blockers.

Active flags:
- `new-account-pages` — gates new account dashboard vs CleanCloud iframe on `/account`

## Styling

CSS global variables and Tailwind work together. The source of truth for brand tokens is `packages/tokens` — both apps consume it via Tailwind config.

On web (`apps/web/src/app/globals.css`), Tailwind 4's `@theme inline` block defines CSS custom properties that map to the token values. These variables are available in both Tailwind classes and raw CSS:

- Colors: `--color-primary`, `--color-navy`, `--color-cream`, etc. Use Tailwind classes (`text-primary`, `bg-navy`) when possible; use `var(--color-*)` in raw CSS or inline styles when Tailwind classes aren't practical.
- Fonts: `--font-heading` (Zilla Slab), `--font-body` (DM Sans). Tailwind classes: `font-heading`, `font-body`.
- Layout: `--header-height` (responsive, used for offset calculations).

On mobile (`apps/mobile/global.css`), NativeWind consumes the `@wdl/tokens` preset via `tailwind.config.js`. No CSS custom properties — use Tailwind classes only.

When adding new design tokens, add them to `packages/tokens/src/` first, then expose via the Tailwind preset. For web-only CSS variables, add to the `@theme inline` block in `globals.css`.

## Env Vars (Required)

- `DATABASE_URL` — Postgres connection string
- `BETTER_AUTH_SECRET` — auth signing secret
- `BETTER_AUTH_URL` — base URL (e.g. `https://wedeliverlaundry.com`)
- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog project API key
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe keys
- `CLEANCLOUD_API_TOKEN` — CleanCloud API token for direct API access
- `EXPO_PUBLIC_API_URL` — mobile app's API base URL

**Optional:**
- `CMS_API_URL` / `NEXT_PUBLIC_CMS_API_URL` — CMS API for SEO metadata, blog, and visual editor

**NEVER hardcode env vars, API keys, or webhook URLs in source code.** All secrets and external URLs go in `.env` locally and in the Vercel dashboard for deployments. Use `process.env.VAR_NAME` to read them. Only `NEXT_PUBLIC_*` vars are available client-side — server secrets (`DATABASE_URL`, `STRIPE_SECRET_KEY`, etc.) must never be exposed to the browser.

## Conventions

- Immutable data patterns — never mutate, always return new objects
- Use `@wdl/tokens` for all colors, typography, spacing — don't hardcode brand values
- **NEVER hardcode hex colors in components.** Use Tailwind token classes (`bg-primary`, `text-navy`, `border-cream`, etc.) defined in `globals.css`. If a color isn't in the token system, add it to `packages/tokens` and `globals.css` first.
- **ALWAYS use shared components** from `@/components/shared` (`ButtonLink`, `Button`, `SectionHeader`, etc.) for UI elements. Never create one-off styled `<Link>` or `<button>` elements with inline classes when a shared component exists.
- **No third-party scripts or iframes without review.** Never inject external JS (GoHighLevel, GTM, chat widgets, etc.) directly into components. All analytics/tracking scripts go through the existing pattern in `@/components/analytics/` using `next/script`. Never use `dangerouslySetInnerHTML` for script injection.
- **Build must pass before pushing.** Run `pnpm build` in `apps/web` and confirm zero errors before pushing to main. Broken builds block the entire team.
- API responses use `{ success: boolean, data?: T, error?: string }` envelope
- Web fonts: Zilla Slab (headings), DM Sans (body)
- Mobile runs in Expo Go — no native modules allowed
