"use client";

import { ButtonLink } from "@/components/shared/button-link";

type ConfirmationProps = {
  readonly customerName?: string;
  readonly pickupTime?: string;
  readonly pickupDate?: string;
  readonly serviceName?: string;
  readonly showUpsell?: boolean;
};

const NEXT_STEPS = [
  { step: "1", text: "We'll text you a reminder before your pickup." },
  { step: "2", text: "Leave your bag outside your door at the scheduled time." },
  { step: "3", text: "We'll wash, fold, and deliver within 24 hours." },
] as const;

export function Confirmation({
  customerName,
  pickupTime,
  pickupDate,
  serviceName,
  showUpsell,
}: ConfirmationProps) {
  const firstName = customerName?.split(" ")[0] ?? "there";

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-heading-medium text-navy mb-2">
        You&apos;re all set, {firstName}!
      </h2>
      <p className="text-sm text-navy/60 font-[family-name:var(--font-poppins)] mb-6">
        Your first pickup has been scheduled.
      </p>

      {(pickupDate || pickupTime || serviceName) && (
        <div className="mb-6 rounded-xl border border-navy/10 bg-navy/[0.02] p-4 text-left">
          <h3 className="mb-2 text-xs font-heading-medium uppercase tracking-wider text-navy/40 font-[family-name:var(--font-poppins)]">
            Pickup Summary
          </h3>
          <dl className="space-y-1.5 text-sm font-[family-name:var(--font-poppins)]">
            {serviceName && (
              <div className="flex justify-between">
                <dt className="text-navy/60">Service</dt>
                <dd className="font-body-medium text-navy">{serviceName}</dd>
              </div>
            )}
            {pickupDate && (
              <div className="flex justify-between">
                <dt className="text-navy/60">Date</dt>
                <dd className="font-body-medium text-navy">{pickupDate}</dd>
              </div>
            )}
            {pickupTime && (
              <div className="flex justify-between">
                <dt className="text-navy/60">Time</dt>
                <dd className="font-body-medium text-navy">{pickupTime}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <div className="mb-6 text-left">
        <h3 className="mb-3 text-sm font-heading-medium text-navy">What happens next</h3>
        <ol className="space-y-3">
          {NEXT_STEPS.map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-body-medium text-primary">
                {step}
              </span>
              <span className="text-sm text-navy/70 font-[family-name:var(--font-poppins)]">
                {text}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {showUpsell && (
        <div className="mb-6 rounded-xl border border-highlight bg-highlight/30 p-4 text-left">
          <p className="text-sm font-body-medium text-navy mb-1">
            Save with weekly pickups
          </p>
          <p className="text-xs text-navy/60 font-[family-name:var(--font-poppins)]">
            Schedule recurring pickups and get free delivery every week.
          </p>
        </div>
      )}

      <ButtonLink href="/" className="w-full">
        Back to Home
      </ButtonLink>
    </div>
  );
}
