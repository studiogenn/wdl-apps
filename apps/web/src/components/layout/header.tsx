"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/shared";

const SERVICES_ITEMS = [
  { label: "Wash & Fold", href: "/wash-fold" },
  { label: "Business & Corporate", href: "/commercial-laundry" },
];

const NAV_ITEMS = [
  { label: "Locations", href: "/service-areas" },
  { label: "About Us", href: "/our-story" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

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
          {/* Services & Pricing Dropdown (hover) */}
          <div className="relative group">
            <button
              className="font-[family-name:var(--font-poppins)] text-navy text-[14px] font-body-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              Services & Pricing
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform group-hover:rotate-180"
              >
                <path d="M3 5l3 3 3-3" />
              </svg>
            </button>

            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute top-full left-0 pt-2">
              <div className="bg-white rounded-lg shadow-lg border border-navy/10 py-2 min-w-[200px]">
                {SERVICES_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 text-[14px] text-navy font-body-medium hover:bg-cream hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-[family-name:var(--font-poppins)] text-navy text-[14px] font-body-medium hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink href="/account/?tab=login" variant="outline" size="sm">
            Sign In
          </ButtonLink>
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
          <ButtonLink href="/account/" size="sm">
            Schedule Pickup
          </ButtonLink>
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
          {/* Mobile Services & Pricing */}
          <button
            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            className="flex items-center justify-between w-full py-3 text-[14px] text-navy font-body-medium border-b border-navy/5"
          >
            Services & Pricing
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
            >
              <path d="M3 5l3 3 3-3" />
            </svg>
          </button>
          {mobileServicesOpen && (
            <div className="pl-4">
              {SERVICES_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-[14px] text-navy/80 font-body-medium hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block py-3 text-[14px] text-navy font-body-medium border-b border-navy/5"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <ButtonLink href="/account/?tab=login" variant="outline" size="sm" className="text-center">
              Sign In
            </ButtonLink>
            <ButtonLink href="/account/" size="sm" className="text-center">
              Schedule Pick-up
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
