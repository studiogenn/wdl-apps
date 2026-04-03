"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { type MembershipTier } from "@/lib/stripe-config";

const TIERS: readonly {
  readonly id: MembershipTier;
  readonly name: string;
  readonly price: number;
  readonly pickups: number;
  readonly includedLbs: number;
  readonly effectiveRate: string;
  readonly savings: string;
  readonly badge: string | null;
  readonly perks: readonly string[];
}[] = [
  {
    id: "weekly",
    name: "Weekly",
    price: 139,
    pickups: 4,
    includedLbs: 80,
    effectiveRate: "$1.74/lb",
    savings: "Save 41% vs Instant",
    badge: "Most Popular",
    perks: [
      "4 pickups/mo",
      "Up to 80 lbs",
      "24-hour turnaround",
    ],
  },
  {
    id: "family",
    name: "Family",
    price: 189,
    pickups: 4,
    includedLbs: 120,
    effectiveRate: "$1.58/lb",
    savings: "Save 46% vs Instant",
    badge: "Best Value",
    perks: [
      "4 pickups/mo",
      "Up to 120 lbs",
      "24-hour turnaround",
      "Family Sort + Hypoallergenic",
    ],
  },
];

const ADD_ONS = [
  { name: "Premium Care", price: "From $5" },
  { name: "Deep Clean", price: "From $3" },
  { name: "Bedding", price: "$29" },
];

const CHECK = (
  <svg className="w-3 h-3 text-primary shrink-0" viewBox="0 0 512 512" fill="currentColor">
    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
  </svg>
);

interface TierSelectionProps {
  readonly selected: MembershipTier;
  readonly onSelect: (tier: MembershipTier) => void;
}

export function TierSelection({ selected, onSelect }: TierSelectionProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-6 lg:py-8">
      <h1 className="font-heading-medium text-navy text-2xl lg:text-3xl uppercase text-center mb-1">
        Laundry, handled.
      </h1>
      <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 text-center mb-6">
        Free pickup & delivery · Cancel anytime · Overages $1.95/lb
      </p>

      {/* Tier cards — side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {TIERS.map((t) => {
          const isSelected = selected === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={cn(
                "relative w-full rounded-2xl border-2 p-5 text-left transition-all",
                isSelected
                  ? "border-primary bg-white shadow-sm"
                  : "border-navy/10 bg-white hover:border-primary/40",
              )}
            >
              {t.badge && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-body-medium font-[family-name:var(--font-poppins)] text-white">
                  {t.badge}
                </span>
              )}

              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading-medium text-navy text-lg uppercase">{t.name}</h3>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-body-bold text-navy">${t.price}</span>
                  <span className="font-[family-name:var(--font-poppins)] text-xs text-navy/50">/mo</span>
                </div>
              </div>

              <p className="mt-1 font-[family-name:var(--font-poppins)] text-xs text-primary font-body-medium">
                {t.effectiveRate} · {t.savings}
              </p>

              <ul className="mt-3 space-y-1">
                {t.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-1.5 font-[family-name:var(--font-poppins)] text-xs text-navy/60">
                    {CHECK} {perk}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isSelected ? "border-primary bg-primary" : "border-navy/20",
                  )}
                >
                  {isSelected && (
                    <svg viewBox="0 0 10 10" fill="none" className="h-2 w-2">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={cn(
                  "font-[family-name:var(--font-poppins)] text-xs font-body-medium",
                  isSelected ? "text-primary" : "text-navy/40",
                )}>
                  {isSelected ? "Selected — tap to continue" : "Select"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Add-ons — compact inline row */}
      <div className="flex items-center justify-center gap-4 flex-wrap mb-4">
        <span className="font-[family-name:var(--font-poppins)] text-[10px] font-body-medium text-navy/30 uppercase tracking-widest">
          Add-ons
        </span>
        {ADD_ONS.map((a) => (
          <span key={a.name} className="font-[family-name:var(--font-poppins)] text-xs text-navy/50">
            {a.name} <span className="text-navy/70 font-body-medium">{a.price}</span>
          </span>
        ))}
      </div>

      {/* Fine print + escape hatch */}
      <p className="text-center font-[family-name:var(--font-poppins)] text-xs text-navy/30">
        Priced at pickup — we text a quote before charging ·{" "}
        <Link href="/pricing" className="text-primary hover:underline">
          Just need one pickup? Instant at $2.95/lb →
        </Link>
      </p>
    </div>
  );
}
