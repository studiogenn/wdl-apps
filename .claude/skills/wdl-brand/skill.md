---
name: wdl-brand
description: We Deliver Laundry brand design system. Use this skill when building any frontend UI, components, screens, or pages for WDL across web (Next.js) and mobile (Expo/React Native). Enforces the Figma-extracted design system with specific color tokens, typography scales, spacing, border radii, component patterns, and layout conventions. Source of truth is packages/tokens/ in the wdl-apps monorepo.
---

# We Deliver Laundry — Brand Design System

## Architecture

Design tokens live in `packages/tokens/` and are consumed by both apps via Tailwind:
- **Web** (`apps/web/`): Tailwind v4, imports tokens in `tailwind.config.ts`
- **Mobile** (`apps/mobile/`): NativeWind/Tailwind v3, uses `wdlPreset` from `@wdl/tokens/tailwind-preset`
- **Shared components** (`packages/ui/`): Button, Input, Badge, Card, Icons — all use token-based Tailwind classes

Never use inline `style={{}}` for fonts, colors, or spacing. Everything goes through Tailwind classes.

## Color Palette

Five scales. Use the Tailwind class names exactly as shown.

### Detergent (Primary Blue)
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| 100 | #E7E9F8 | `bg-detergent-100` | Hover states, surface-alt, stat cards |
| 200 | #CFD3F2 | `bg-detergent-200` | Trust bar text, dividers on dark |
| 300 | #5967D1 | `text-detergent-300` | Processing badges |
| 400 | #1227BE | `bg-detergent-400` | Primary buttons, links, focus rings |
| 500 | #0E1F98 | `bg-detergent-500` | Primary button hover, trust bar bg |
| 600 | #070F4C | `bg-detergent-600` | — |
| 700 | #050B39 | `bg-detergent-700` | Text color, footer bg, nav text |

### Fresh Lemon (Accent Yellow)
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| 100 | #FAF1C3 | `bg-fresh-lemon-100` | Savings badges, pending badges |
| 200 | #F9EBAA | `bg-fresh-lemon-200` | Secondary buttons, step badges, stars |
| 300 | #C7BC88 | `bg-fresh-lemon-300` | Secondary button hover |

### Seabreeze (Warm Cream)
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| 100 | #FEFEFC | `bg-seabreeze-100` | Lightest surface |
| 200 | #F9F8ED | `bg-seabreeze-200` | Hover on cream backgrounds |
| 300 | #F7F5E6 | `bg-seabreeze-300` | Page background, hero background |

### Neutral
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| 100 | #FFFFFF | `bg-neutral-100` | Cards, surfaces, inputs |
| 200 | #F2F2F2 | `bg-neutral-200` | Default input bg, icon containers |
| 300 | #D9DADA | `border-neutral-300` | Borders, dividers, input borders |
| 400 | #B4B5B6 | `text-neutral-400` | Placeholder text, disabled text |
| 500 | #838585 | `text-neutral-500` | Muted body text, descriptions |

### Destructive
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| 100 | #E16A70 | `bg-destructive-100` | Error badges |
| 200 | #AF2C33 | `bg-destructive-200` | Destructive buttons, error text |
| 300 | #6B0C11 | `bg-destructive-300` | Destructive button hover |

### Semantic Aliases
These map to the scales above. Prefer the scale names in code; use these for quick reference:
- `primary` = detergent-400
- `background` = seabreeze-300
- `surface` = neutral-100
- `text` = detergent-700
- `text-muted` = neutral-500
- `accent` = fresh-lemon-200
- `border` = neutral-300

## Typography

Two font families. Never use Poppins, Inter, or system fonts for brand content.

### Font Families
| Tailwind class | Font | Weight | Usage |
|----------------|------|--------|-------|
| `font-heading` | Zilla Slab | 400 (Regular) | Headlines (uppercase) |
| `font-heading-medium` | Zilla Slab | 500 (Medium) | Subheads, CTA buttons, card titles |
| `font-heading-bold` | Zilla Slab | 700 (Bold) | — |
| `font-body` | DM Sans | 400 (Regular) | Default body, data |
| `font-body-light` | DM Sans | 300 (Light) | Body copy, descriptions |
| `font-body-medium` | DM Sans | 500 (Medium) | Labels, badges, body bold, prices |
| `font-body-bold` | DM Sans | 700 (Bold) | — |

### Type Scale

Each entry bundles size + line-height + letter-spacing. Use as `text-{name}`.

| Category | Class | Size | LH | LS | Font | Transform |
|----------|-------|------|----|----|------|-----------|
| **Metric** | `text-metric-l` | 48px | 130% | -0.03em | DM Sans Regular | none |
| | `text-metric-m` | 40px | 130% | -0.03em | DM Sans Regular | none |
| **Headline** | `text-headline-m` | 42px | 130% | 0.02em | Zilla Slab Regular | **UPPERCASE** |
| | `text-headline-s` | 28px | 130% | 0.02em | Zilla Slab Regular | **UPPERCASE** |
| **Subhead** | `text-subhead-m` | 32px | 130% | 0 | Zilla Slab Medium | none |
| | `text-subhead-s` | 24px | 100% | 0 | Zilla Slab Medium | none |
| **Price** | `text-price-s` | 28px | 130% | 0 | DM Sans Medium | none |
| **Body** | `text-body-l` | 24px | 150% | -0.03em | DM Sans Light | none |
| | `text-body-m` | 18px | 150% | -0.03em | DM Sans Light | none |
| | `text-body-s` | 16px | 150% | -0.03em | DM Sans Light | none |
| | `text-body-xs` | 14px | 150% | -0.03em | DM Sans Light | none |
| **Body Bold** | `text-body-bold-l` | 24px | 150% | -0.03em | DM Sans Medium | none |
| | `text-body-bold-m` | 18px | 150% | -0.03em | DM Sans Medium | none |
| | `text-body-bold-s` | 16px | 150% | -0.03em | DM Sans Medium | none |
| | `text-body-bold-xs` | 14px | 150% | -0.03em | DM Sans Medium | none |
| **CTA** | `text-cta-m` | 20px | 150% | 0.06em | Zilla Slab Medium | **UPPERCASE** |
| **Subtext** | `text-subtext-m` | 20px | 150% | 0.06em | DM Sans Medium | **UPPERCASE** |
| | `text-subtext-s` | 16px | 150% | 0.06em | DM Sans Medium | **UPPERCASE** |
| | `text-subtext-xs` | 10px | 150% | 0.06em | DM Sans Medium | **UPPERCASE** |

**Important:** `text-{size}` sets size/line-height/letter-spacing but NOT font-family or text-transform. You must combine them:
```
// Headline
className="font-heading text-headline-s uppercase text-detergent-700"

// CTA button text
className="font-heading-medium text-cta-m uppercase text-neutral-100"

// Body description
className="font-body-light text-body-s text-neutral-500"

// Subtext label
className="font-body-medium text-subtext-xs uppercase text-detergent-400"
```

### Letter Spacing (standalone)
| Class | Value | Usage |
|-------|-------|-------|
| `tracking-tight` | -0.03em | Body text |
| `tracking-normal` | 0 | Subheads, prices |
| `tracking-headline` | 0.02em | Headlines |
| `tracking-cta` | 0.06em | CTAs, subtexts, labels |

## Spacing & Layout

### Border Radii
| Class | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 8px | Small elements, input code boxes |
| `rounded-md` | 16px | Inputs, small cards |
| `rounded-btn` | 22.5px | All buttons (pill shape) |
| `rounded-card` | 32px | Standard cards, stat cards |
| `rounded-card-lg` | 56px | Service/pricing cards |
| `rounded-full` | 9999px | Avatars, circular badges |

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight gaps |
| sm | 8px | Internal padding |
| md | 16px | Standard padding |
| lg | 24px | Section internal padding |
| xl | 32px | Card padding |
| 2xl | 48px | Section spacing |
| 3xl | 64px | Large section spacing |
| 4xl | 96px | Page-level padding |

### Box Shadows
| Class | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation |
| `shadow-md` | Cards, dropdowns |
| `shadow-lg` | Modals, overlays |
| `shadow-xl` | Popovers, floating elements |

## Component Patterns

### Buttons
All buttons use `rounded-btn` (pill shape). Four variants:

**Primary** — main CTA
```
className="rounded-btn bg-detergent-400 px-8 py-3 font-body-medium text-body-s text-neutral-100 active:bg-detergent-500"
```

**Secondary** — accent CTA
```
className="rounded-btn bg-fresh-lemon-200 px-8 py-3 font-body-medium text-body-s text-detergent-700 active:bg-fresh-lemon-300"
```

**Outline** — secondary action
```
className="rounded-btn border-2 border-detergent-400 bg-transparent px-8 py-3 font-body-medium text-body-s text-detergent-400 active:bg-detergent-100"
```

**Ghost** — tertiary action
```
className="rounded-btn bg-transparent px-8 py-3 font-body-medium text-body-s text-detergent-400 active:bg-detergent-100"
```

**Destructive**
```
className="rounded-btn bg-destructive-200 px-8 py-3 font-body-medium text-body-s text-neutral-100 active:bg-destructive-300"
```

**Disabled state:** Add `opacity-40 cursor-not-allowed` / `disabled:opacity-40` on any variant.

**Two sizes:** lg = `px-8 py-3 text-body-s`, sm = `px-6 py-2 text-body-xs`

### Cards
Standard card:
```
className="rounded-card bg-neutral-100 border border-neutral-300 p-8"
```

Stat card:
```
className="rounded-card bg-detergent-100 p-8 text-center"
```

Service/pricing card:
```
className="rounded-card-lg bg-neutral-100 border border-neutral-300 px-8 pt-10 pb-8"
```

### Inputs
```
className="h-14 w-full rounded-md border-2 border-neutral-300 bg-neutral-200 px-4 font-body-light text-body-s text-detergent-700 placeholder:text-neutral-400 focus:border-detergent-400 focus:bg-neutral-100"
```

Error state: `border-destructive-200` + error text in `text-destructive-200`

### Badges
Step badge: `rounded-full bg-fresh-lemon-200 px-4 py-1.5 font-body-medium text-subtext-xs uppercase text-detergent-700`
Status active: `rounded-full bg-detergent-100 px-3 py-1 font-body-medium text-subtext-xs uppercase text-detergent-400`
Status error: `rounded-full bg-destructive-100 px-3 py-1 font-body-medium text-subtext-xs uppercase text-neutral-100`
Section label: `font-body-medium text-subtext-s uppercase text-detergent-400`

### Page Section Headers
Standard pattern used across all screens:
```
// Overline label
<Text className="font-body-medium text-subtext-xs uppercase tracking-cta text-detergent-400">
  Section Label
</Text>

// Section title (headline)
<Text className="font-heading text-headline-s uppercase tracking-headline text-detergent-700 mt-1">
  Section Title
</Text>

// Optional description
<Text className="font-body-light text-body-s tracking-tight text-neutral-500 mt-2">
  Description text here
</Text>
```

## Layout Conventions

### Page Backgrounds
- Default page bg: `bg-seabreeze-300`
- Auth screens: `bg-seabreeze-300` (light) or `bg-detergent-400` (welcome/splash)
- Dark sections: `bg-detergent-700` (footer)

### Mobile Screen Structure
```jsx
<SafeAreaView className="flex-1 bg-seabreeze-300">
  <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
    <View className="px-6 pt-6 pb-2">
      {/* Section header */}
    </View>
    <View className="mx-6 mt-6">
      {/* Content cards */}
    </View>
  </ScrollView>
</SafeAreaView>
```

### Web Container
```
.container-site — max-w-[1280px] with responsive horizontal padding
```

## Anti-Patterns

- Never use `style={{fontFamily: "..."}}` — use `font-heading`, `font-body-light`, etc.
- Never use `style={{letterSpacing: ...}}` — use `tracking-tight`, `tracking-cta`, etc.
- Never use `bg-white` — use `bg-neutral-100` or `bg-seabreeze-300`
- Never use `text-gray-*` — use `text-neutral-*`
- Never use `rounded-2xl`, `rounded-xl` — use `rounded-md`, `rounded-btn`, `rounded-card`
- Never use `font-bold`, `font-medium`, `font-semibold` — use `font-heading-bold`, `font-body-medium`, etc.
- Never use generic `text-sm`, `text-lg`, `text-3xl` for brand content — use the type scale (`text-body-s`, `text-headline-s`, etc.)
- Never use Poppins or Inter for brand content — DM Sans (body) and Zilla Slab (headings) only
- Never hardcode hex values — always reference token classes
