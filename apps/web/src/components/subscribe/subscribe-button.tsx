"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/shared";
import { STRIPE_IDS } from "@/lib/stripe-config";

export function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: STRIPE_IDS.subscription.basePriceId,
          successUrl: `${window.location.origin}/subscribe/success`,
          cancelUrl: `${window.location.origin}/subscribe`,
        }),
      });

      const data = await res.json();

      if (!data.success || !data.data?.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <Button
        className="w-full"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Redirecting to checkout..." : "Subscribe Now"}
      </Button>
      {error ? (
        <p className="mt-3 text-center font-[family-name:var(--font-poppins)] text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
