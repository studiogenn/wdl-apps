"use client";

import { useEffect, useState } from "react";

type Product = {
  readonly productID: number;
  readonly name: string;
  readonly price: number;
};

type ServiceSelectorProps = {
  readonly onSelect: (product: Product) => void;
  readonly onBack: () => void;
};

const SERVICE_ICONS: ReadonlyMap<string, string> = new Map([
  ["wash", "shirt"],
  ["fold", "shirt"],
  ["dry clean", "sparkles"],
  ["iron", "flame"],
  ["press", "flame"],
]);

function getServiceIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of SERVICE_ICONS) {
    if (lower.includes(key)) return icon;
  }
  return "package";
}

const TRUST_SIGNALS = [
  "9,000+ happy customers",
  "Free delivery for weekly customers",
  "24-hour turnaround",
] as const;

export function ServiceSelector({ onSelect, onBack }: ServiceSelectorProps) {
  const [products, setProducts] = useState<ReadonlyArray<Product>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/cleancloud/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
          setProducts(data.data.products);
        } else {
          setError(data.error);
        }
      } catch {
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-heading-medium text-navy mb-2">Choose a Service</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-navy/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-heading-medium text-navy mb-2">Choose a Service</h2>
      <p className="text-sm text-navy/60 font-[family-name:var(--font-poppins)] mb-4">
        Select the service that works best for you.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {TRUST_SIGNALS.map((signal) => (
          <span
            key={signal}
            className="rounded-full bg-highlight px-3 py-1 text-[11px] font-body-medium text-navy/70 font-[family-name:var(--font-poppins)]"
          >
            {signal}
          </span>
        ))}
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 font-[family-name:var(--font-poppins)]">{error}</p>
      )}

      <div className="space-y-3 mb-6">
        {products.map((product) => (
          <button
            key={product.productID}
            type="button"
            onClick={() => onSelect(product)}
            className="flex w-full items-center gap-4 rounded-xl border border-navy/10 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/[0.02]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary">
              <ServiceIcon name={getServiceIcon(product.name)} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-body-medium text-navy">{product.name}</p>
              <p className="text-xs text-navy/50 font-[family-name:var(--font-poppins)]">
                Starting at ${(product.price / 100).toFixed(2)}
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy/30">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full rounded-full border border-navy/15 px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-body-medium text-navy hover:bg-navy/5 transition-colors"
      >
        Back
      </button>
    </div>
  );
}

function ServiceIcon({ name }: { name: string }) {
  switch (name) {
    case "shirt":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      );
    case "sparkles":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
        </svg>
      );
    case "flame":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
        </svg>
      );
  }
}
