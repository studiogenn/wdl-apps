import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/button-link";

export const metadata: Metadata = {
  title: "Thank You — Welcome to We Deliver Laundry",
  description: "Your subscription is confirmed. Welcome to We Deliver Laundry.",
  robots: { index: false },
};

export default function SubscribeThankYouPage() {
  return (
    <div className="min-h-[calc(100dvh-var(--header-height))] bg-cream flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-[520px]">

        {/* Card */}
        <div className="bg-white rounded-2xl px-8 py-12 text-center shadow-sm">

          {/* Icon */}
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg, #1227BE 0%, #050B39 100%)" }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M7 14l5 5 9-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="font-heading-medium text-navy uppercase text-[1.75rem] leading-tight mb-3">
            You&apos;re all set!
          </h1>
          <p className="font-[family-name:var(--font-poppins)] text-[15px] text-navy/60 leading-relaxed mb-2">
            Welcome to We Deliver Laundry. Your subscription is confirmed and your first pickup is just a few clicks away.
          </p>

          {/* Divider */}
          <div className="my-7 h-px bg-navy/10" />

          {/* What's next */}
          <p className="font-[family-name:var(--font-poppins)] text-[11px] font-semibold uppercase tracking-[2px] text-navy/40 mb-5">
            What happens next
          </p>
          <div className="space-y-4 text-left mb-8">
            {[
              {
                step: "1",
                title: "Check your email",
                body: "You'll receive a confirmation with your plan details and a receipt.",
              },
              {
                step: "2",
                title: "Schedule your first pickup",
                body: "Log in to your account and choose a date and time window that works for you.",
              },
              {
                step: "3",
                title: "We handle the rest",
                body: "Leave your bag at the door — we pick up, wash, fold, and deliver back within 24 hours.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                  style={{ background: "#1227BE" }}
                >
                  {item.step}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-poppins)] text-[13px] font-semibold text-navy mb-0.5">
                    {item.title}
                  </p>
                  <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/55 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <ButtonLink href="/account" className="w-full justify-center">
            Go to My Account
          </ButtonLink>
          <div className="mt-3">
            <ButtonLink href="/" variant="outline" className="w-full justify-center">
              Back to Home
            </ButtonLink>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center font-[family-name:var(--font-poppins)] text-xs text-navy/35">
          Questions? Email us at{" "}
          <a href="mailto:start@wedeliverlaundry.com" className="underline hover:text-navy/60">
            start@wedeliverlaundry.com
          </a>
        </p>
      </div>
    </div>
  );
}
