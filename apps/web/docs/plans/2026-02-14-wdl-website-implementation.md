# WDL Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the We Deliver Laundry marketing website with Next.js 15, replacing the existing WordPress site.

**Architecture:** Next.js App Router with static generation for all public pages. Radix UI primitives styled with Tailwind CSS. MDX for blog content, JSON for location data, Supabase server actions for contact form. Deployed on Vercel.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Radix UI, Framer Motion, next-mdx-remote, Supabase, next-sitemap, Vitest, Testing Library, Playwright

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, `.env.example`

**Step 1: Initialize Next.js project**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: Project scaffolded with App Router, TypeScript, Tailwind, ESLint.

**Step 2: Install dependencies**

Run:
```bash
npm install @radix-ui/react-dialog @radix-ui/react-accordion @radix-ui/react-select @radix-ui/react-toast @radix-ui/react-tabs @radix-ui/react-dropdown-menu @radix-ui/react-label framer-motion next-mdx-remote @supabase/supabase-js next-sitemap
```

Expected: All dependencies installed.

**Step 3: Install dev dependencies**

Run:
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test
```

Expected: Test tooling installed.

**Step 4: Configure Tailwind with WDL brand tokens**

Update `tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wdl: {
          primary: "#2B4EE8",
          accent: "#F5E6A3",
          white: "#FFFFFF",
          dark: "#1a1a2e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 5: Configure Vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Create `src/test/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

**Step 6: Create .env.example**

Create `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_FB_PIXEL_ID=
```

**Step 7: Update .gitignore**

Ensure `.gitignore` includes:
```
.env
.env.local
```

**Step 8: Verify project builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind, Radix UI, and test tooling"
```

---

## Task 2: Constants and Brand Tokens

**Files:**
- Create: `src/lib/constants.ts`
- Test: `src/lib/constants.test.ts`

**Step 1: Write the test**

Create `src/lib/constants.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { BRAND, COMPANY, NAV_LINKS } from "./constants";

describe("constants", () => {
  it("has correct brand colors", () => {
    expect(BRAND.colors.primary).toBe("#2B4EE8");
    expect(BRAND.colors.accent).toBe("#F5E6A3");
    expect(BRAND.colors.dark).toBe("#1a1a2e");
  });

  it("has correct company info", () => {
    expect(COMPANY.name).toBe("We Deliver Laundry");
    expect(COMPANY.phone).toBe("855-968-5511");
    expect(COMPANY.email).toBe("hello@wedeliverlaundry.com");
  });

  it("has nav links with paths", () => {
    expect(NAV_LINKS.length).toBeGreaterThan(0);
    NAV_LINKS.forEach((link) => {
      expect(link.href).toMatch(/^\//);
      expect(link.label).toBeTruthy();
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/constants.test.ts`
Expected: FAIL — module not found.

**Step 3: Write implementation**

Create `src/lib/constants.ts`:
```ts
export const BRAND = {
  colors: {
    primary: "#2B4EE8",
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
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
} as const;
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/constants.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/constants.ts src/lib/constants.test.ts
git commit -m "feat: add brand tokens and company constants"
```

---

## Task 3: Root Layout with Fonts

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Update globals.css**

Replace contents of `src/app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --wdl-primary: #2B4EE8;
  --wdl-accent: #F5E6A3;
  --wdl-white: #FFFFFF;
  --wdl-text-dark: #1a1a2e;
}

body {
  @apply bg-white text-wdl-dark antialiased;
}
```

**Step 2: Update root layout**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "We Deliver Laundry | Pickup & Delivery Within 24 Hours",
    template: "%s | We Deliver Laundry",
  },
  description:
    "Professional laundry pickup and delivery service. Washed, folded, and returned within 24 hours. Free delivery for weekly customers.",
  metadataBase: new URL("https://wedeliverlaundry.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "We Deliver Laundry",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: configure root layout with Inter font and brand CSS variables"
```

---

## Task 4: Header Component

**Files:**
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/mobile-menu.tsx`
- Test: `src/components/layout/header.test.tsx`

**Step 1: Write the failing test**

Create `src/components/layout/header.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./header";

describe("Header", () => {
  it("renders the company name", () => {
    render(<Header />);
    expect(screen.getByText("We Deliver Laundry")).toBeInTheDocument();
  });

  it("renders nav links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /services & pricing/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /how it works/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /locations/i })).toBeInTheDocument();
  });

  it("renders schedule pickup CTA", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /schedule pickup/i })).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/header.test.tsx`
Expected: FAIL — module not found.

**Step 3: Write Header implementation**

Create `src/components/layout/header.tsx`:
```tsx
"use client";

import Link from "next/link";
import { NAV_LINKS, COMPANY } from "@/lib/constants";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-wdl-primary">
          {COMPANY.name}
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-wdl-dark transition-colors hover:text-wdl-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link
            href="https://wedeliverlaundry.com/my-account/"
            className="rounded-lg bg-wdl-primary px-5 py-2.5 text-sm font-bold uppercase text-white transition-colors hover:bg-wdl-primary/90"
          >
            Schedule Pickup
          </Link>
        </div>

        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
```

**Step 4: Write MobileMenu implementation**

Create `src/components/layout/mobile-menu.tsx`:
```tsx
"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="p-2 text-wdl-dark"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-bold text-wdl-primary">
            Menu
          </Dialog.Title>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 p-2 text-wdl-dark"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </Dialog.Close>

          <nav className="mt-8">
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-wdl-dark transition-colors hover:text-wdl-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="https://wedeliverlaundry.com/my-account/"
            className="mt-8 block rounded-lg bg-wdl-primary px-5 py-3 text-center text-sm font-bold uppercase text-white"
            onClick={() => setOpen(false)}
          >
            Schedule Pickup
          </Link>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

**Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/layout/header.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add Header and MobileMenu components"
```

---

## Task 5: Footer Component

**Files:**
- Create: `src/components/layout/footer.tsx`
- Test: `src/components/layout/footer.test.tsx`

**Step 1: Write the failing test**

Create `src/components/layout/footer.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders company phone number", () => {
    render(<Footer />);
    expect(screen.getByText("855-968-5511")).toBeInTheDocument();
  });

  it("renders company email", () => {
    render(<Footer />);
    expect(screen.getByText("hello@wedeliverlaundry.com")).toBeInTheDocument();
  });

  it("renders terms of service link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /terms of service/i })).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/footer.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

Create `src/components/layout/footer.tsx`:
```tsx
import Link from "next/link";
import { COMPANY, NAV_LINKS, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-wdl-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">{COMPANY.name}</h3>
            <p className="mt-2 text-sm text-gray-300">{COMPANY.tagline}</p>
            <p className="mt-4 text-sm text-gray-300">{COMPANY.address}</p>
          </div>

          <div>
            <h4 className="font-bold">Quick Links</h4>
            <ul className="mt-2 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-wdl-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Contact</h4>
            <ul className="mt-2 flex flex-col gap-2 text-sm text-gray-300">
              <li>
                <a href={`tel:${COMPANY.phone}`} className="hover:text-wdl-accent">
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className="hover:text-wdl-accent">
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <ul className="flex gap-4">
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-400 transition-colors hover:text-wdl-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/layout/footer.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/layout/footer.tsx src/components/layout/footer.test.tsx
git commit -m "feat: add Footer component"
```

---

## Task 6: Wire Layout (Header + Footer into Root Layout)

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Update root layout**

Add Header and Footer to `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "We Deliver Laundry | Pickup & Delivery Within 24 Hours",
    template: "%s | We Deliver Laundry",
  },
  description:
    "Professional laundry pickup and delivery service. Washed, folded, and returned within 24 hours. Free delivery for weekly customers.",
  metadataBase: new URL("https://wedeliverlaundry.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "We Deliver Laundry",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wire Header and Footer into root layout"
```

---

## Task 7: UI Primitives (Button, Card)

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Test: `src/components/ui/button.test.tsx`

**Step 1: Write the failing test**

Create `src/components/ui/button.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("renders primary variant by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-wdl-primary");
  });

  it("renders secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-wdl-accent");
  });

  it("renders as a link when href is provided", () => {
    render(<Button href="/test">Link</Button>);
    expect(screen.getByRole("link", { name: /link/i })).toHaveAttribute("href", "/test");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/button.test.tsx`
Expected: FAIL

**Step 3: Write Button implementation**

Create `src/components/ui/button.tsx`:
```tsx
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  href?: string;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
};

const variants = {
  primary: "bg-wdl-primary text-white hover:bg-wdl-primary/90",
  secondary: "bg-wdl-accent text-wdl-dark hover:bg-wdl-accent/90",
  outline: "border-2 border-wdl-primary text-wdl-primary hover:bg-wdl-primary hover:text-white",
} as const;

export function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  className = "",
  onClick,
}: ButtonProps) {
  const classes = `inline-block rounded-lg px-6 py-3 text-sm font-bold uppercase transition-colors ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
```

**Step 4: Write Card component**

Create `src/components/ui/card.tsx`:
```tsx
type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
```

**Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/ui/button.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add Button and Card UI primitives"
```

---

## Task 8: Homepage

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/sections/hero.tsx`
- Create: `src/components/sections/process-flow.tsx`
- Test: `src/app/page.test.tsx`

**Step 1: Write the failing test**

Create `src/app/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the hero headline", () => {
    render(<HomePage />);
    expect(screen.getByText(/within 24 hours/i)).toBeInTheDocument();
  });

  it("renders the schedule pickup CTA", () => {
    render(<HomePage />);
    expect(screen.getByRole("link", { name: /schedule pickup/i })).toBeInTheDocument();
  });

  it("renders the 4-step process flow", () => {
    render(<HomePage />);
    expect(screen.getByText(/pickup/i)).toBeInTheDocument();
    expect(screen.getByText(/wash/i)).toBeInTheDocument();
    expect(screen.getByText(/fold/i)).toBeInTheDocument();
    expect(screen.getByText(/deliver/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/page.test.tsx`
Expected: FAIL

**Step 3: Write Hero section**

Create `src/components/sections/hero.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-wdl-primary px-4 py-20 text-center text-white sm:py-32">
      <div className="mx-auto max-w-3xl">
        <motion.h1
          className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Laundry Pickup & Delivery{" "}
          <span className="text-wdl-accent">Within 24 Hours</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg text-white/80 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Washed, folded, and returned to your doorstep. Free delivery for
          weekly customers.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button variant="secondary" href="https://wedeliverlaundry.com/my-account/">
            Schedule Pickup
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 4: Write ProcessFlow section**

Create `src/components/sections/process-flow.tsx`:
```tsx
const STEPS = [
  { title: "Pickup", description: "We collect laundry from your door" },
  { title: "Wash", description: "Professional cleaning removes dirt and stains" },
  { title: "Fold", description: "Neatly folded to your preferences" },
  { title: "Deliver", description: "Returned to your doorstep within 24 hours" },
] as const;

export function ProcessFlow() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-wdl-dark">
          How It Works
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wdl-primary text-xl font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-bold text-wdl-dark">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 5: Write HomePage**

Replace `src/app/page.tsx`:
```tsx
import { Hero } from "@/components/sections/hero";
import { ProcessFlow } from "@/components/sections/process-flow";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProcessFlow />
    </>
  );
}
```

**Step 6: Run test to verify it passes**

Run: `npx vitest run src/app/page.test.tsx`
Expected: PASS

**Step 7: Commit**

```bash
git add src/app/page.tsx src/app/page.test.tsx src/components/sections/
git commit -m "feat: add Homepage with Hero and ProcessFlow sections"
```

---

## Task 9: Services & Pricing Page

**Files:**
- Create: `src/app/services-pricing/page.tsx`
- Create: `src/components/sections/pricing-card.tsx`
- Test: `src/app/services-pricing/page.test.tsx`

**Step 1: Write the failing test**

Create `src/app/services-pricing/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesPage from "./page";

describe("ServicesPage", () => {
  it("renders page heading", () => {
    render(<ServicesPage />);
    expect(screen.getByRole("heading", { name: /services & pricing/i })).toBeInTheDocument();
  });

  it("renders weekly plan", () => {
    render(<ServicesPage />);
    expect(screen.getByText(/weekly/i)).toBeInTheDocument();
    expect(screen.getByText(/free/i)).toBeInTheDocument();
  });

  it("renders pay as you go plan", () => {
    render(<ServicesPage />);
    expect(screen.getByText(/pay as you go/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/services-pricing/page.test.tsx`
Expected: FAIL

**Step 3: Write PricingCard component**

Create `src/components/sections/pricing-card.tsx`:
```tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: readonly string[];
  highlighted?: boolean;
};

export function PricingCard({
  title,
  price,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <Card
      className={`flex flex-col ${highlighted ? "border-wdl-primary ring-2 ring-wdl-primary" : ""}`}
    >
      <h3 className="text-xl font-bold text-wdl-dark">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-wdl-primary">{price}</p>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-0.5 text-wdl-primary">&#10003;</span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button
          href="https://wedeliverlaundry.com/my-account/"
          variant={highlighted ? "primary" : "outline"}
          className="w-full text-center"
        >
          Get Started
        </Button>
      </div>
    </Card>
  );
}
```

**Step 4: Write Services & Pricing page**

Create `src/app/services-pricing/page.tsx`:
```tsx
import type { Metadata } from "next";
import { PricingCard } from "@/components/sections/pricing-card";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Affordable laundry pickup and delivery. Weekly plans with free delivery or pay as you go. $25 minimum order.",
};

const PLANS = [
  {
    title: "Weekly",
    price: "FREE Delivery",
    description: "Best for regular customers with recurring needs.",
    features: [
      "Free pickup and delivery",
      "$25 minimum order",
      "24-hour turnaround",
      "Custom preferences honored",
      "Cancel anytime",
    ],
    highlighted: true,
  },
  {
    title: "Pay As You Go",
    price: "$9.95 transport",
    description: "Best for occasional or on-demand users.",
    features: [
      "$9.95 transport fee per order",
      "$25 minimum order",
      "24-hour turnaround",
      "Custom preferences honored",
      "No commitment",
    ],
    highlighted: false,
  },
] as const;

export default function ServicesPage() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-3xl font-bold text-wdl-dark sm:text-4xl">
          Services & Pricing
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Professional wash and fold with pickup and delivery within 24 hours.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <PricingCard key={plan.title} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 5: Run test to verify it passes**

Run: `npx vitest run src/app/services-pricing/page.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/app/services-pricing/ src/components/sections/pricing-card.tsx
git commit -m "feat: add Services & Pricing page with plan cards"
```

---

## Task 10: How It Works Page

**Files:**
- Create: `src/app/how-it-works/page.tsx`

**Step 1: Write the page**

Create `src/app/how-it-works/page.tsx`:
```tsx
import type { Metadata } from "next";
import { ProcessFlow } from "@/components/sections/process-flow";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Schedule a pickup, we wash and fold your laundry, and deliver it back within 24 hours.",
};

export default function HowItWorksPage() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-3xl font-bold text-wdl-dark sm:text-4xl">
          How It Works
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Getting your laundry done has never been easier. Four simple steps.
        </p>
      </div>
      <ProcessFlow />
      <div className="mt-12 text-center">
        <Button href="https://wedeliverlaundry.com/my-account/">
          Schedule Your First Pickup
        </Button>
      </div>
    </section>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/app/how-it-works/
git commit -m "feat: add How It Works page"
```

---

## Task 11: Location Data and Pages

**Files:**
- Create: `src/content/locations/index.ts`
- Create: `src/app/locations/page.tsx`
- Create: `src/app/locations/[slug]/page.tsx`
- Create: `src/components/sections/location-card.tsx`
- Test: `src/content/locations/index.test.ts`

**Step 1: Write the failing test**

Create `src/content/locations/index.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { LOCATIONS, getLocationBySlug } from "./index";

describe("locations data", () => {
  it("has locations defined", () => {
    expect(LOCATIONS.length).toBeGreaterThan(0);
  });

  it("each location has required fields", () => {
    LOCATIONS.forEach((loc) => {
      expect(loc.name).toBeTruthy();
      expect(loc.slug).toBeTruthy();
      expect(loc.state).toBeTruthy();
      expect(loc.neighborhoods.length).toBeGreaterThan(0);
    });
  });

  it("finds a location by slug", () => {
    const first = LOCATIONS[0];
    const found = getLocationBySlug(first.slug);
    expect(found).toEqual(first);
  });

  it("returns undefined for unknown slug", () => {
    expect(getLocationBySlug("nonexistent")).toBeUndefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/content/locations/index.test.ts`
Expected: FAIL

**Step 3: Write location data**

Create `src/content/locations/index.ts`:
```ts
export type Location = {
  readonly name: string;
  readonly slug: string;
  readonly state: string;
  readonly neighborhoods: readonly string[];
};

export const LOCATIONS: readonly Location[] = [
  {
    name: "Manhattan",
    slug: "manhattan",
    state: "NY",
    neighborhoods: [
      "Battery Park City", "Chelsea", "East Harlem", "East Village",
      "Financial District", "Inwood", "Washington Heights",
      "Lower East Side", "Midtown East", "Midtown West",
      "Murray Hill", "Tribeca", "Upper East Side", "Upper West Side", "West Village",
    ],
  },
  {
    name: "Queens",
    slug: "queens",
    state: "NY",
    neighborhoods: ["Jamaica", "Ozone Park", "Richmond Hills", "Far Rockaway"],
  },
  {
    name: "Long Island",
    slug: "long-island",
    state: "NY",
    neighborhoods: [
      "Bellerose", "East Meadow", "Elmont", "Freeport", "Garden City",
      "Hempstead", "Levittown", "Long Beach", "Oceanside", "Valley Stream",
    ],
  },
  {
    name: "Hudson County",
    slug: "hudson-county",
    state: "NJ",
    neighborhoods: [
      "Bayonne", "Harrison", "Hoboken", "Jersey City", "Kearny",
      "North Bergen", "Secaucus", "Union City", "Weehawken", "West New York",
    ],
  },
  {
    name: "Bergen County",
    slug: "bergen-county",
    state: "NJ",
    neighborhoods: [
      "Dumont", "Englewood", "Fair Lawn", "Fort Lee", "Hackensack",
      "Oakland", "Paramus", "Ridgewood", "River Vale", "Rochelle Park", "Teaneck", "Westwood",
    ],
  },
  {
    name: "Essex County",
    slug: "essex-county",
    state: "NJ",
    neighborhoods: ["Bloomfield", "Clifton", "East Orange", "Livingston", "Montclair"],
  },
  {
    name: "Morris County",
    slug: "morris-county",
    state: "NJ",
    neighborhoods: [
      "Cedar Knolls", "Chatham", "Chester", "Madison",
      "Morris Plains", "Morristown", "Parsippany-Troy Hills",
    ],
  },
  {
    name: "Union County",
    slug: "union-county",
    state: "NJ",
    neighborhoods: ["Elizabeth", "Plainfield", "Westfield"],
  },
  {
    name: "Passaic County",
    slug: "passaic-county",
    state: "NJ",
    neighborhoods: ["Paterson"],
  },
  {
    name: "Middlesex County",
    slug: "middlesex-county",
    state: "NJ",
    neighborhoods: ["Avenel"],
  },
] as const;

export function getLocationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find((loc) => loc.slug === slug);
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/content/locations/index.test.ts`
Expected: PASS

**Step 5: Write LocationCard component**

Create `src/components/sections/location-card.tsx`:
```tsx
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Location } from "@/content/locations";

export function LocationCard({ location }: { location: Location }) {
  return (
    <Card>
      <Link href={`/locations/${location.slug}`} className="block">
        <h3 className="text-lg font-bold text-wdl-dark">
          {location.name}, {location.state}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {location.neighborhoods.slice(0, 5).join(", ")}
          {location.neighborhoods.length > 5 && ` +${location.neighborhoods.length - 5} more`}
        </p>
      </Link>
    </Card>
  );
}
```

**Step 6: Write Locations hub page**

Create `src/app/locations/page.tsx`:
```tsx
import type { Metadata } from "next";
import { LOCATIONS } from "@/content/locations";
import { LocationCard } from "@/components/sections/location-card";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "We Deliver Laundry serves Manhattan, Queens, Long Island, and New Jersey. Find laundry pickup and delivery near you.",
};

export default function LocationsPage() {
  const nyLocations = LOCATIONS.filter((l) => l.state === "NY");
  const njLocations = LOCATIONS.filter((l) => l.state === "NJ");

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-3xl font-bold text-wdl-dark sm:text-4xl">
          Service Areas
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Laundry pickup and delivery across New York and New Jersey.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-wdl-dark">New York</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nyLocations.map((loc) => (
            <LocationCard key={loc.slug} location={loc} />
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold text-wdl-dark">New Jersey</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {njLocations.map((loc) => (
            <LocationCard key={loc.slug} location={loc} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 7: Write individual location page with SSG**

Create `src/app/locations/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCATIONS, getLocationBySlug } from "@/content/locations";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return LOCATIONS.map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return {};

  return {
    title: `Laundry Delivery in ${location.name}, ${location.state}`,
    description: `Professional laundry pickup and delivery in ${location.name}, ${location.state}. Serving ${location.neighborhoods.slice(0, 3).join(", ")} and more. Within 24 hours.`,
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY.name,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1351 Queen Anne Rd",
      addressLocality: "Teaneck",
      addressRegion: "NJ",
      postalCode: "07666",
    },
    areaServed: location.neighborhoods.map((n) => ({
      "@type": "City",
      name: n,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-wdl-dark sm:text-4xl">
            Laundry Delivery in {location.name}, {location.state}
          </h1>
          <p className="mt-4 text-gray-600">
            We pick up, wash, fold, and deliver your laundry within 24 hours in{" "}
            {location.name} and surrounding areas.
          </p>

          <h2 className="mt-10 text-xl font-bold text-wdl-dark">
            Areas We Serve
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {location.neighborhoods.map((n) => (
              <li key={n} className="text-sm text-gray-700">
                {n}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button href="https://wedeliverlaundry.com/my-account/">
              Schedule Pickup in {location.name}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
```

**Step 8: Verify build**

Run: `npm run build`
Expected: Build succeeds. Location pages statically generated.

**Step 9: Commit**

```bash
git add src/content/locations/ src/app/locations/ src/components/sections/location-card.tsx
git commit -m "feat: add Locations hub and individual location pages with SSG"
```

---

## Task 12: Blog Infrastructure (MDX)

**Files:**
- Create: `src/lib/blog.ts`
- Create: `src/content/blog/welcome.mdx`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/components/sections/blog-card.tsx`
- Test: `src/lib/blog.test.ts`

**Step 1: Write the failing test**

Create `src/lib/blog.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug } from "./blog";

describe("blog", () => {
  it("returns all posts sorted by date descending", async () => {
    const posts = await getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime()
      );
    }
  });

  it("each post has required frontmatter", async () => {
    const posts = await getAllPosts();
    posts.forEach((post) => {
      expect(post.title).toBeTruthy();
      expect(post.date).toBeTruthy();
      expect(post.excerpt).toBeTruthy();
      expect(post.slug).toBeTruthy();
    });
  });

  it("finds a post by slug", async () => {
    const posts = await getAllPosts();
    const found = await getPostBySlug(posts[0].slug);
    expect(found).toBeDefined();
    expect(found!.title).toBe(posts[0].title);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/blog.test.ts`
Expected: FAIL

**Step 3: Write blog utility**

Create `src/lib/blog.ts`:
```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type PostMeta = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  tags: string[];
};

export type Post = PostMeta & {
  content: string;
};

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data } = matter(raw);

    return {
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      slug,
      tags: data.tags ?? [],
    } as PostMeta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    slug,
    tags: data.tags ?? [],
    content,
  };
}
```

**Note:** Also install gray-matter:
```bash
npm install gray-matter
```

**Step 4: Create a sample blog post**

Create `src/content/blog/welcome.mdx`:
```mdx
---
title: "Welcome to We Deliver Laundry"
date: "2026-02-14"
excerpt: "Introducing our new website and laundry delivery service."
tags: ["news"]
---

# Welcome to We Deliver Laundry

We're excited to launch our new website! We pick up, wash, fold, and deliver your laundry within 24 hours.

## Why Choose Us?

- **Free delivery** for weekly customers
- **24-hour turnaround** on all orders
- **Professional cleaning** with safe detergents
- Service across **New York and New Jersey**

Ready to get started? [Schedule your first pickup](https://wedeliverlaundry.com/my-account/) today.
```

**Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/blog.test.ts`
Expected: PASS

**Step 6: Write BlogCard component**

Create `src/components/sections/blog-card.tsx`:
```tsx
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { PostMeta } from "@/lib/blog";

export function BlogCard({ post }: { post: PostMeta }) {
  return (
    <Card>
      <Link href={`/blog/${post.slug}`} className="block">
        <time className="text-xs text-gray-500">{post.date}</time>
        <h3 className="mt-1 text-lg font-bold text-wdl-dark">{post.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>
      </Link>
    </Card>
  );
}
```

**Step 7: Write Blog index page**

Create `src/app/blog/page.tsx`:
```tsx
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/sections/blog-card";

export const metadata: Metadata = {
  title: "Blog",
  description: "Laundry tips, stain removal guides, and news from We Deliver Laundry.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-3xl font-bold text-wdl-dark sm:text-4xl">
          Blog
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Laundry tips, fabric care guides, and company news.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 8: Write individual blog post page**

Create `src/app/blog/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="px-4 py-16 sm:py-24">
        <div className="prose prose-lg mx-auto max-w-3xl">
          <time className="text-sm text-gray-500">{post.date}</time>
          <h1>{post.title}</h1>
          <MDXRemote source={post.content} />
        </div>
      </article>
    </>
  );
}
```

**Note:** Install Tailwind Typography for blog prose styling:
```bash
npm install @tailwindcss/typography
```

Add to `tailwind.config.ts` plugins:
```ts
plugins: [require("@tailwindcss/typography")],
```

**Step 9: Verify build**

Run: `npm run build`
Expected: Build succeeds. Blog pages statically generated.

**Step 10: Commit**

```bash
git add src/lib/blog.ts src/lib/blog.test.ts src/content/blog/ src/app/blog/ src/components/sections/blog-card.tsx tailwind.config.ts package.json package-lock.json
git commit -m "feat: add blog infrastructure with MDX and sample post"
```

---

## Task 13: FAQ Page

**Files:**
- Create: `src/content/faq.ts`
- Create: `src/app/faq/page.tsx`
- Test: `src/content/faq.test.ts`

**Step 1: Write the failing test**

Create `src/content/faq.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { FAQ_ITEMS } from "./faq";

describe("FAQ data", () => {
  it("has FAQ items", () => {
    expect(FAQ_ITEMS.length).toBeGreaterThan(0);
  });

  it("each item has question and answer", () => {
    FAQ_ITEMS.forEach((item) => {
      expect(item.question).toBeTruthy();
      expect(item.answer).toBeTruthy();
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/content/faq.test.ts`
Expected: FAIL

**Step 3: Write FAQ data**

Create `src/content/faq.ts`:
```ts
export type FaqItem = {
  readonly question: string;
  readonly answer: string;
};

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "How does pickup and delivery work?",
    answer:
      "Schedule a pickup online. Our driver collects your laundry from your door, we wash and fold it professionally, and return it within 24 hours.",
  },
  {
    question: "What is the minimum order?",
    answer:
      "The minimum order is $25. There is no minimum weight requirement.",
  },
  {
    question: "How much does delivery cost?",
    answer:
      "Weekly plan customers get free pickup and delivery. Pay As You Go customers pay a $9.95 transport fee per order.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve Manhattan, Queens, Long Island in New York, and multiple counties in New Jersey including Hudson, Bergen, Essex, Morris, Union, Passaic, and Middlesex counties.",
  },
  {
    question: "Can I cancel my weekly plan?",
    answer:
      "Yes, you can cancel anytime. There is no commitment or contract.",
  },
  {
    question: "What detergents do you use?",
    answer:
      "We use safe, professional-grade laundry soaps and detergents. If you have preferences or allergies, let us know and we will accommodate.",
  },
  {
    question: "How do I track my order?",
    answer:
      "You will receive notifications when your delivery is due. You can also track your order through your account on our website.",
  },
] as const;
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/content/faq.test.ts`
Expected: PASS

**Step 5: Write FAQ page**

Create `src/app/faq/page.tsx`:
```tsx
"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { FAQ_ITEMS } from "@/content/faq";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-center text-3xl font-bold text-wdl-dark sm:text-4xl">
            Frequently Asked Questions
          </h1>

          <Accordion.Root type="single" collapsible className="mt-12">
            {FAQ_ITEMS.map((item, i) => (
              <Accordion.Item
                key={i}
                value={`item-${i}`}
                className="border-b border-gray-200"
              >
                <Accordion.Trigger className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-wdl-dark hover:text-wdl-primary">
                  {item.question}
                  <span className="ml-4 text-wdl-primary">+</span>
                </Accordion.Trigger>
                <Accordion.Content className="pb-4 text-gray-600">
                  {item.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>
    </>
  );
}
```

**Note:** FAQ page is a client component because Radix Accordion requires client interactivity. The metadata must be set differently for client components. Create a separate metadata file:

Create `src/app/faq/layout.tsx`:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about We Deliver Laundry pickup and delivery service.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

**Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 7: Commit**

```bash
git add src/content/faq.ts src/content/faq.test.ts src/app/faq/
git commit -m "feat: add FAQ page with Radix Accordion and JSON-LD schema"
```

---

## Task 14: Contact Page with Supabase

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/contact/actions.ts`

**Step 1: Create Supabase client**

Create `src/lib/supabase.ts`:
```ts
import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, key);
}
```

**Step 2: Create server action**

Create `src/app/contact/actions.ts`:
```ts
"use server";

import { createServerSupabase } from "@/lib/supabase";

type ContactFormState = {
  success: boolean;
  error: string | null;
};

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Name, email, and message are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const supabase = createServerSupabase();
    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      phone: phone || null,
      message,
    });

    if (error) {
      return { success: false, error: "Something went wrong. Please try again." };
    }

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
```

**Step 3: Write Contact page**

Create `src/app/contact/page.tsx`:
```tsx
"use client";

import { useActionState } from "react";
import { submitContactForm } from "./actions";
import { COMPANY } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const initialState = { success: false, error: null };

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-3xl font-bold text-wdl-dark sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-4 text-center text-gray-600">
          Have a question? Reach out and we will get back to you.
        </p>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Call us:{" "}
            <a href={`tel:${COMPANY.phone}`} className="font-medium text-wdl-primary">
              {COMPANY.phone}
            </a>
          </p>
          <p>
            Email:{" "}
            <a href={`mailto:${COMPANY.email}`} className="font-medium text-wdl-primary">
              {COMPANY.email}
            </a>
          </p>
        </div>

        {state.success ? (
          <div className="mt-12 rounded-lg bg-green-50 p-6 text-center text-green-800">
            Thank you! We will get back to you soon.
          </div>
        ) : (
          <form action={formAction} className="mt-12 flex flex-col gap-4">
            {state.error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-wdl-dark">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-wdl-primary focus:outline-none focus:ring-1 focus:ring-wdl-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-wdl-dark">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-wdl-primary focus:outline-none focus:ring-1 focus:ring-wdl-primary"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-wdl-dark">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-wdl-primary focus:outline-none focus:ring-1 focus:ring-wdl-primary"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-wdl-dark">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-wdl-primary focus:outline-none focus:ring-1 focus:ring-wdl-primary"
              />
            </div>

            <Button type="submit" className="mt-4">
              {pending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
```

**Step 4: Create contact layout for metadata**

Create `src/app/contact/layout.tsx`:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with We Deliver Laundry. Call 855-968-5511 or send us a message.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 6: Commit**

```bash
git add src/lib/supabase.ts src/app/contact/
git commit -m "feat: add Contact page with Supabase server action"
```

---

## Task 15: About Page

**Files:**
- Create: `src/app/about/page.tsx`

**Step 1: Write the page**

Create `src/app/about/page.tsx`:
```tsx
import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: `${COMPANY.name} is a professional laundry pickup and delivery service based in Teaneck, NJ, serving New York and New Jersey.`,
};

export default function AboutPage() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-3xl font-bold text-wdl-dark sm:text-4xl">
          About {COMPANY.name}
        </h1>

        <div className="mt-8 space-y-6 text-gray-600">
          <p>
            We Deliver Laundry is a professional laundry pickup and delivery
            service based in Teaneck, New Jersey. We serve customers across
            Manhattan, Queens, Long Island, and multiple counties in New Jersey.
          </p>

          <p>
            Our mission is simple: save you time. We pick up your laundry from
            your doorstep, wash and fold it with care using safe, professional-grade
            detergents, and return it within 24 hours.
          </p>

          <p>
            Whether you are a busy professional, a family managing large loads,
            or a business needing reliable linen services, we have a plan that
            fits your needs.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Button href="/services-pricing">View Our Services</Button>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/app/about/
git commit -m "feat: add About page"
```

---

## Task 16: Terms of Service Page

**Files:**
- Create: `src/app/terms/page.tsx`

**Step 1: Write the page**

Create `src/app/terms/page.tsx`:
```tsx
import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${COMPANY.name}.`,
};

export default function TermsPage() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="prose mx-auto max-w-3xl">
        <h1>Terms of Service</h1>
        <p>
          <em>Last updated: February 2026</em>
        </p>
        <p>
          These terms govern your use of the {COMPANY.name} website and services.
          By using our services, you agree to these terms.
        </p>

        <h2>Service Description</h2>
        <p>
          {COMPANY.name} provides laundry pickup, washing, folding, and delivery
          services. We aim to return your laundry within 24 hours of pickup.
        </p>

        <h2>Pricing</h2>
        <p>
          The minimum order is $25. Weekly plan customers receive free pickup and
          delivery. Pay As You Go customers are charged a $9.95 transport fee per
          order. Prices are subject to change with notice.
        </p>

        <h2>Cancellation</h2>
        <p>
          Weekly plans can be cancelled at any time with no penalty or commitment.
        </p>

        <h2>Liability</h2>
        <p>
          While we take great care with your garments, {COMPANY.name} is not
          responsible for items that are damaged due to pre-existing wear, improper
          labeling, or items left in pockets. Claims must be made within 48 hours
          of delivery.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Contact us at{" "}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or call{" "}
          <a href={`tel:${COMPANY.phone}`}>{COMPANY.phone}</a>.
        </p>
      </div>
    </section>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/app/terms/
git commit -m "feat: add Terms of Service page"
```

---

## Task 17: Sitemap and SEO Config

**Files:**
- Create: `next-sitemap.config.js`
- Modify: `package.json` (add postbuild script)

**Step 1: Create next-sitemap config**

Create `next-sitemap.config.js`:
```js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://wedeliverlaundry.com",
  generateRobotsTxt: true,
  exclude: ["/account/*", "/signup", "/login"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account/", "/signup", "/login"],
      },
    ],
  },
};
```

**Step 2: Add postbuild script to package.json**

Add to `package.json` scripts:
```json
"postbuild": "next-sitemap"
```

**Step 3: Verify build generates sitemap**

Run: `npm run build`
Expected: Build succeeds. `public/sitemap.xml` and `public/robots.txt` generated.

**Step 4: Commit**

```bash
git add next-sitemap.config.js package.json
git commit -m "feat: add sitemap and robots.txt generation"
```

---

## Task 18: Analytics Integration

**Files:**
- Create: `src/components/analytics/posthog-provider.tsx`
- Create: `src/components/analytics/google-analytics.tsx`
- Create: `src/components/analytics/facebook-pixel.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create PostHog provider**

Create `src/components/analytics/posthog-provider.tsx`:
```tsx
"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (key && host) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: true,
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
```

**Note:** Install posthog-js:
```bash
npm install posthog-js
```

**Step 2: Create Google Analytics component**

Create `src/components/analytics/google-analytics.tsx`:
```tsx
import Script from "next/script";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
```

**Step 3: Create Facebook Pixel component**

Create `src/components/analytics/facebook-pixel.tsx`:
```tsx
import Script from "next/script";

export function FacebookPixel() {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  if (!pixelId) return null;

  return (
    <Script id="facebook-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
```

**Step 4: Wire analytics into root layout**

Update `src/app/layout.tsx` to include analytics components:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { FacebookPixel } from "@/components/analytics/facebook-pixel";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "We Deliver Laundry | Pickup & Delivery Within 24 Hours",
    template: "%s | We Deliver Laundry",
  },
  description:
    "Professional laundry pickup and delivery service. Washed, folded, and returned within 24 hours. Free delivery for weekly customers.",
  metadataBase: new URL("https://wedeliverlaundry.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "We Deliver Laundry",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <PostHogProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </PostHogProvider>
        <GoogleAnalytics />
        <FacebookPixel />
      </body>
    </html>
  );
}
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 6: Commit**

```bash
git add src/components/analytics/ src/app/layout.tsx package.json package-lock.json
git commit -m "feat: add PostHog, Google Analytics, and Facebook Pixel"
```

---

## Task 19: Final Build Verification and E2E Smoke Test

**Files:**
- Create: `e2e/smoke.spec.ts`

**Step 1: Write E2E smoke test**

Create `e2e/smoke.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Within 24 Hours")).toBeVisible();
    await expect(page.getByRole("link", { name: /schedule pickup/i })).toBeVisible();
  });

  test("navigation works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /services & pricing/i }).click();
    await expect(page.getByRole("heading", { name: /services & pricing/i })).toBeVisible();
  });

  test("FAQ accordion works", async ({ page }) => {
    await page.goto("/faq");
    await page.getByText("How does pickup and delivery work?").click();
    await expect(page.getByText("Schedule a pickup online")).toBeVisible();
  });

  test("contact form renders", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
  });

  test("blog page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /blog/i })).toBeVisible();
  });

  test("locations page loads", async ({ page }) => {
    await page.goto("/locations");
    await expect(page.getByText("New York")).toBeVisible();
    await expect(page.getByText("New Jersey")).toBeVisible();
  });
});
```

**Step 2: Configure Playwright**

Create `playwright.config.ts`:
```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: "npm run build && npm run start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
});
```

**Step 3: Run full build**

Run: `npm run build`
Expected: All pages build successfully. Output shows static pages generated for all routes.

**Step 4: Run E2E tests**

Run: `npx playwright install --with-deps chromium && npx playwright test`
Expected: All smoke tests pass.

**Step 5: Commit**

```bash
git add e2e/ playwright.config.ts
git commit -m "test: add E2E smoke tests for all pages"
```
