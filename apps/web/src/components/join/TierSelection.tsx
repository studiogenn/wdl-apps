"use client";

import { cn } from "@/lib/cn";
import { type MembershipTier } from "@/lib/stripe-config";
import { SectionHeader } from "@/components/shared/section-header";

const TIERS: readonly {
  readonly id: MembershipTier;
  readonly name: string;
  readonly price: number;
  readonly pickups: number;
  readonly includedLbs: number;
  readonly effectiveRate: string;
  readonly savings: string;
  readonly badge: string | null;
}[] = [
  {
    id: "starter",
    name: "Starter",
    price: 79,
    pickups: 2,
    includedLbs: 40,
    effectiveRate: "$1.98/lb",
    savings: "Convenience + consistency",
    badge: null,
  },
  {
    id: "standard",
    name: "Standard",
    price: 129,
    pickups: 4,
    includedLbs: 80,
    effectiveRate: "$1.61/lb",
    savings: "Save 17% vs on-demand",
    badge: "Most Popular",
  },
  {
    id: "family",
    name: "Family",
    price: 169,
    pickups: 4,
    includedLbs: 120,
    effectiveRate: "$1.41/lb",
    savings: "Save 28% vs on-demand",
    badge: "Best Value",
  },
];

const CHECK = (
  <svg className="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 512 512" fill="currentColor">
    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
  </svg>
);

interface TierSelectionProps {
  readonly selected: MembershipTier;
  readonly onSelect: (tier: MembershipTier) => void;
}

export function TierSelection({ selected, onSelect }: TierSelectionProps) {
  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <SectionHeader
        eyebrow="Choose your plan"
        heading="Laundry, handled."
        description="Free pickup & delivery. Cancel anytime. Overages billed at $1.95/lb."
        headingAs="h1"
      />

      <div className="flex flex-col gap-4">
        {TIERS.map((t) => {
          const isSelected = selected === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={cn(
                "relative w-full rounded-2xl border-2 p-6 text-left transition-all",
                isSelected
                  ? "border-primary bg-white shadow-sm"
                  : "border-navy/10 bg-white hover:border-primary/40",
              )}
            >
              {t.badge && (
                <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-[11px] font-body-medium font-[family-name:var(--font-poppins)] text-white">
                  {t.badge}
                </span>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-heading-medium text-navy text-lg uppercase">
                    {t.name}
                  </h3>
                  <p className="mt-1 font-[family-name:var(--font-poppins)] text-sm text-navy/50">
                    {t.pickups} pickups/mo · Up to {t.includedLbs} lbs
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-body-bold text-navy">${t.price}</span>
                  <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/50">/mo</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <span className="flex items-center gap-1.5 font-[family-name:var(--font-poppins)] text-xs text-navy/60">
                  {CHECK} {t.effectiveRate}
                </span>
                <span className="flex items-center gap-1.5 font-[family-name:var(--font-poppins)] text-xs text-primary font-body-medium">
                  {CHECK} {t.savings}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isSelected ? "border-primary bg-primary" : "border-navy/20",
                  )}
                >
                  {isSelected && (
                    <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={cn(
                  "font-[family-name:var(--font-poppins)] text-sm font-body-medium",
                  isSelected ? "text-primary" : "text-navy/40",
                )}>
                  {isSelected ? "Selected" : "Select"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center font-[family-name:var(--font-poppins)] text-xs text-navy/40">
        All plans include free pickup & delivery · 24-hour turnaround · Cancel anytime
      </p>
      <p className="mt-2 text-center font-[family-name:var(--font-poppins)] text-xs text-navy/40">
        Go over your included weight? No surprise fees — extra pounds billed at $1.95/lb.
      </p>
    </div>
  );
}
