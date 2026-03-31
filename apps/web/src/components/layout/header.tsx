"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Wash & Fold", href: "/wash-fold" },
  { label: "Locations", href: "/service-areas" },
  { label: "About Us", href: "/our-story" },
  { label: "Business & Corporate", href: "/commercial-laundry" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between max-w-[1280px] mx-auto px-8 py-4">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="We Deliver Laundry"
            width={90}
            height={25}
            priority
          />
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-[family-name:var(--font-poppins)] text-navy text-[14px] font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/account/?tab=login"
            className="font-[family-name:var(--font-inter)] px-5 py-2.5 text-[14px] font-normal text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex lg:hidden items-center justify-between px-5 py-3">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="We Deliver Laundry"
            width={70}
            height={20}
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/account/"
            className="font-[family-name:var(--font-inter)] px-4 py-2 text-[12px] font-normal text-white bg-primary rounded-full"
          >
            Schedule Pickup
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-navy"
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-cream border-t border-navy/10 px-5 py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block py-3 text-[14px] text-navy font-medium border-b border-navy/5"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/account/?tab=login"
              className="text-center py-2.5 text-[14px] font-normal text-primary border border-primary rounded-full"
            >
              Sign In
            </Link>
            <Link
              href="/account/"
              className="text-center py-2.5 text-[14px] font-normal text-white bg-primary rounded-full"
            >
              Schedule Pick-up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
