"use client";

import { useState, useCallback } from "react";
import { fromCleanCloudTimestamp } from "@/lib/cleancloud/dates";
import { Button } from "@/components/shared";
import { cn } from "@/lib/cn";

// ─── Types ──────────────────────────────────────────────────────────────────

type Product = {
  readonly productID: number;
  readonly name: string;
  readonly price: number;
};

type Preferences = {
  readonly current: {
    readonly detergent: string | null;
    readonly bleach: string | null;
    readonly fabricSoftener: string | null;
    readonly dryerTemperature: string | null;
    readonly dryerSheets: string | null;
  };
  readonly options: Readonly<Record<string, readonly string[]>>;
};

type OrderSummaryProps = {
  readonly pickupTimestamp: number;
  readonly pickupSlot: string;
  readonly products: ReadonlyArray<Product>;
  readonly preferences: Preferences;
  readonly onBack: () => void;
  readonly onSubmit: (order: OrderPayload) => void;
  readonly submitting: boolean;
  readonly submitError: string;
};

export type OrderPayload = {
  readonly selectedProducts: ReadonlyArray<{ productID: number; quantity: number }>;
  readonly orderNotes: string;
  readonly finalTotal: number;
};

// ─── Preference config ──────────────────────────────────────────────────────

const PREFERENCE_FIELDS = [
  { key: "detergent", label: "Detergent" },
  { key: "bleach", label: "Bleach" },
  { key: "fabricSoftener", label: "Fabric Softener" },
  { key: "dryerTemperature", label: "Dryer Temperature" },
  { key: "dryerSheets", label: "Dryer Sheets" },
] as const;

type PrefKey = (typeof PREFERENCE_FIELDS)[number]["key"];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function OrderSummary({
  pickupTimestamp,
  pickupSlot,
  products,
  preferences,
  onBack,
  onSubmit,
  submitting,
  submitError,
}: OrderSummaryProps) {
  const pickupDate = fromCleanCloudTimestamp(pickupTimestamp);

  // Product selection — map of productID → quantity (0 = not selected)
  const [selectedProducts, setSelectedProducts] = useState<ReadonlyMap<number, number>>(
    () => new Map()
  );

  // Preference overrides
  const [prefOverrides, setPrefOverrides] = useState<Readonly<Record<string, string>>>({});

  // Instructions
  const [notes, setNotes] = useState("");

  // ─── Product handlers ─────────────────────────────────────────────────

  const toggleProduct = useCallback((productID: number) => {
    setSelectedProducts((prev) => {
      const next = new Map(prev);
      if (next.has(productID)) {
        next.delete(productID);
      } else {
        next.set(productID, 1);
      }
      return next;
    });
  }, []);

  // ─── Preference handler ───────────────────────────────────────────────

  const setPref = useCallback((key: string, value: string) => {
    setPrefOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ─── Build order notes with preference overrides ──────────────────────

  function buildOrderNotes(): string {
    const parts: string[] = [];

    // Preference changes
    const changes: string[] = [];
    for (const { key, label } of PREFERENCE_FIELDS) {
      const override = prefOverrides[key];
      const current = preferences.current[key];
      if (override && override !== current) {
        changes.push(`${label}: ${override}`);
      }
    }
    if (changes.length > 0) {
      parts.push(`Preferences: ${changes.join(", ")}`);
    }

    // Customer instructions
    if (notes.trim()) {
      parts.push(notes.trim());
    }

    return parts.join("\n\n");
  }

  // ─── Submit ───────────────────────────────────────────────────────────

  const handleSubmit = () => {
    const productEntries = Array.from(selectedProducts.entries())
      .filter(([, qty]) => qty > 0)
      .map(([productID, quantity]) => ({ productID, quantity }));

    const total = productEntries.reduce((sum, { productID, quantity }) => {
      const product = products.find((p) => p.productID === productID);
      return sum + (product ? product.price * quantity : 0);
    }, 0);

    onSubmit({
      selectedProducts: productEntries,
      orderNotes: buildOrderNotes(),
      finalTotal: total,
    });
  };

  // ─── Computed ─────────────────────────────────────────────────────────

  const total = Array.from(selectedProducts.entries()).reduce((sum, [productID, qty]) => {
    const product = products.find((p) => p.productID === productID);
    return sum + (product ? product.price * qty : 0);
  }, 0);

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading-medium text-navy">Order Summary</h1>
          <p className="mt-1 text-sm text-navy/50 font-body">
            Review your pickup details before scheduling.
          </p>
        </div>

        {/* Pickup details */}
        <div className="rounded-xl border border-navy/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-navy/40 tracking-widest uppercase font-body-medium mb-1">
                Pickup
              </span>
              <span className="block text-sm font-heading-medium text-navy">
                {formatDateLabel(pickupDate)}
              </span>
              <span className="block text-sm text-navy/60 font-body mt-0.5">
                {pickupSlot}
              </span>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-xs text-primary font-body-medium hover:underline underline-offset-2"
            >
              Change
            </button>
          </div>
        </div>

        {/* Services / Add-ons */}
        {products.length > 0 && (
          <div className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="text-sm font-heading-medium text-navy mb-3">Services</h2>
            <div className="space-y-2">
              {products.map((product) => {
                const isOn = selectedProducts.has(product.productID);
                return (
                  <button
                    key={product.productID}
                    type="button"
                    onClick={() => toggleProduct(product.productID)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
                      isOn
                        ? "border-primary bg-primary/5"
                        : "border-navy/10 hover:border-navy/20"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                        isOn
                          ? "border-primary bg-primary"
                          : "border-navy/20"
                      )}
                    >
                      {isOn && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6l2.5 2.5L9.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={cn("block text-sm", isOn ? "text-primary font-body-medium" : "text-navy")}>
                        {product.name}
                      </span>
                    </div>
                    <span className="text-xs text-navy/50 font-body">
                      {formatPrice(product.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Preferences */}
        {PREFERENCE_FIELDS.some(({ key }) =>
          (preferences.options[key]?.length ?? 0) > 0
        ) && (
          <div className="rounded-xl border border-navy/10 bg-white p-5">
            <h2 className="text-sm font-heading-medium text-navy mb-3">Laundry Preferences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PREFERENCE_FIELDS.map(({ key, label }) => {
                const opts = preferences.options[key];
                if (!opts || opts.length === 0) return null;

                const currentValue = prefOverrides[key] ?? preferences.current[key as PrefKey] ?? "";

                return (
                  <div key={key}>
                    <label
                      htmlFor={`pref-${key}`}
                      className="mb-1 block text-xs text-navy/50 font-body"
                    >
                      {label}
                    </label>
                    <select
                      id={`pref-${key}`}
                      value={currentValue}
                      onChange={(e) => setPref(key, e.target.value)}
                      className="w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy font-body focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">No preference</option>
                      {opts.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Special instructions */}
        <div className="rounded-xl border border-navy/10 bg-white p-5">
          <h2 className="text-sm font-heading-medium text-navy mb-3">Special Instructions</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests for this order..."
            maxLength={1000}
            rows={3}
            className="w-full resize-none rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-sm text-navy font-body placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <span className="mt-1 block text-right text-[10px] text-navy/30 font-body">
            {notes.length}/1000
          </span>
        </div>

        {/* Error */}
        {submitError && (
          <p className="text-sm text-red-600 font-body">{submitError}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between rounded-xl border border-navy/10 bg-white p-5">
          <div>
            {total > 0 && (
              <div>
                <span className="block text-[10px] text-navy/40 tracking-widest uppercase font-body-medium">
                  Estimated Total
                </span>
                <span className="block text-lg font-heading-medium text-navy">
                  {formatPrice(total)}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={onBack} disabled={submitting}>
              Back
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Scheduling..." : "Schedule Pickup"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
