import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/shared";

export const metadata: Metadata = {
  title: "Quote Received — Commercial Laundry",
  description:
    "Your commercial laundry quote request has been received. Our team will reach out within 24 hours.",
  robots: { index: false, follow: false },
};

function CheckmarkIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
      <polyline
        points="7,18 15,26 29,10"
        stroke="var(--color-highlight)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}



function TruckWatermark() {
  return (
    <svg
      className="absolute -bottom-2 -right-4 w-40 opacity-[0.07] pointer-events-none"
      viewBox="0 0 200 100"
      fill="none"
    >
      <rect x="30" y="15" width="120" height="65" rx="8" stroke="var(--color-primary)" strokeWidth="5" fill="none" />
      <path d="M150 35 L175 35 L185 55 L185 75 L150 75 Z" stroke="var(--color-primary)" strokeWidth="5" strokeLinejoin="round" fill="none" />
      <circle cx="55" cy="80" r="12" stroke="var(--color-primary)" strokeWidth="5" fill="none" />
      <circle cx="165" cy="80" r="12" stroke="var(--color-primary)" strokeWidth="5" fill="none" />
      <line x1="5" y1="45" x2="28" y2="45" stroke="var(--color-primary)" strokeWidth="5" strokeLinecap="round" />
      <line x1="10" y1="57" x2="28" y2="57" stroke="var(--color-primary)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export default function CommercialThankYouPage() {
  return (
    <div className="bg-primary min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 py-[60px]">
      {/* Supergraphic background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M-80 120 Q200 60 400 180 Q600 300 880 200" stroke="#A2D5E6" strokeWidth="32" fill="none" strokeLinecap="round" />
        <path d="M-80 220 Q200 160 400 280 Q600 400 880 300" stroke="#A2D5E6" strokeWidth="32" fill="none" strokeLinecap="round" />
        <path d="M-80 320 Q200 260 400 380 Q600 500 880 400" stroke="#A2D5E6" strokeWidth="32" fill="none" strokeLinecap="round" />
        <path d="M-80 420 Q200 360 400 480 Q600 580 880 480" stroke="#A2D5E6" strokeWidth="32" fill="none" strokeLinecap="round" />
      </svg>

      {/* Logo */}
      <div className="mb-[52px] animate-[fadeUp_0.6s_ease_both] relative z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/logo-horizontal-white.svg"
          alt="We Deliver Laundry"
          className="h-14 w-auto"
        />
      </div>

      {/* Card */}
      <div className="bg-cream rounded-3xl px-7 py-10 sm:px-16 sm:py-14 max-w-[680px] w-full text-center relative animate-[fadeUp_0.7s_0.1s_ease_both] opacity-0 z-10">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-8 animate-[popIn_0.5s_0.5s_cubic-bezier(0.34,1.56,0.64,1)_both] opacity-0">
          <CheckmarkIcon />
        </div>

        <span className="inline-block bg-highlight text-primary font-[family-name:var(--font-zilla-slab)] text-[11px] font-medium tracking-[2px] uppercase px-[18px] py-1.5 rounded-full mb-5">
          Quote Received
        </span>

        <h1 className="font-[family-name:var(--font-zilla-slab)] text-[26px] sm:text-[36px] font-normal text-primary uppercase tracking-[1.5px] leading-[1.15] mb-4">
          We&apos;ll Handle<br />It From Here.
        </h1>

        <p className="font-[family-name:var(--font-dm-sans)] text-base text-primary/70 leading-[1.65] max-w-[440px] mx-auto mb-10">
          Your commercial laundry quote request is in. A member of our team will
          reach out within 24 hours with a custom plan built for your business.
        </p>

        <div className="w-12 h-0.5 bg-primary/15 mx-auto mb-10 rounded-full" />

        <p className="font-[family-name:var(--font-zilla-slab)] text-xs tracking-[2.5px] uppercase text-primary/45 mb-6">
          What happens next
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          {[
            {
              n: "1",
              title: "Team reviews your needs",
              desc: "We look at your volume, frequency, and location to build the right plan.",
            },
            {
              n: "2",
              title: "Custom quote — no surprises",
              desc: "You\u2019ll get a clear, per-pound price tailored to your business.",
            },
            {
              n: "3",
              title: "Pickup starts fast",
              desc: "Once approved, we schedule your first pickup — usually within days.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="bg-white rounded-2xl p-5 border-[1.5px] border-primary/[0.08]"
            >
              <div className="w-7 h-7 rounded-full bg-primary text-white font-[family-name:var(--font-zilla-slab)] text-[13px] font-medium flex items-center justify-center mb-3">
                {step.n}
              </div>
              <p className="font-[family-name:var(--font-zilla-slab)] text-[13px] font-medium text-primary leading-[1.3] tracking-[0.3px] mb-1">
                {step.title}
              </p>
              <p className="font-[family-name:var(--font-dm-sans)] text-xs text-primary/55 leading-[1.5]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3">
          <ButtonLink
            href="/"
            className="w-full max-w-[320px] text-center tracking-[2px] uppercase"
          >
            Back to Home
          </ButtonLink>
          <Link
            href="/service-areas"
            className="font-[family-name:var(--font-dm-sans)] text-sm text-primary/55 underline decoration-dotted underline-offset-4 hover:text-primary/70 transition-colors"
          >
            Check our service areas
          </Link>
        </div>

        {/* Contact strip */}
        <div className="mt-10 pt-7 border-t border-primary/10 flex items-center justify-center gap-6 flex-wrap">
          <a href="tel:+18559685511" className="font-[family-name:var(--font-dm-sans)] text-[13px] text-primary/60 hover:text-primary transition-colors">
            855.968.5511
          </a>
          <span className="w-1 h-1 rounded-full bg-primary/25" />
          <a href="mailto:start@wedeliverlaundry.com" className="font-[family-name:var(--font-dm-sans)] text-[13px] text-primary/60 hover:text-primary transition-colors">
            start@wedeliverlaundry.com
          </a>
          <span className="w-1 h-1 rounded-full bg-primary/25" />
          <a href="https://www.instagram.com/wedeliverlaundry" target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-dm-sans)] text-[13px] text-primary/60 hover:text-primary transition-colors">
            @wedeliverlaundry
          </a>
        </div>

        <TruckWatermark />
      </div>
    </div>
  );
}
