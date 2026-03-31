"use client";

import { useState } from "react";

type PromoInputProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
};

export function PromoInput({ value, onChange }: PromoInputProps) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="text-xs text-primary font-body-medium font-[family-name:var(--font-poppins)] hover:underline"
      >
        Have a promo code?
      </button>
    );
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-body-medium text-navy/70 font-[family-name:var(--font-poppins)]">
        Promo Code (optional)
      </label>
      <input
        type="text"
        placeholder="Enter code"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        maxLength={50}
        className="w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/30 font-[family-name:var(--font-poppins)] text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
