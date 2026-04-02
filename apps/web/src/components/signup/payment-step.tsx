"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/shared";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const STRIPE_APPEARANCE = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#1B3A5C",
    borderRadius: "12px",
    fontFamily: "DM Sans, system-ui, sans-serif",
  },
};

type PaymentFormProps = {
  readonly onSuccess: (paymentIntentId: string) => void;
  readonly onBack: () => void;
  readonly loading?: boolean;
};

function PaymentForm({ onSuccess, onBack, loading: externalLoading }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setSubmitting(true);
      setError(null);

      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message ?? "Payment failed.");
        setSubmitting(false);
        return;
      }

      if (result.paymentIntent) {
        onSuccess(result.paymentIntent.id);
      }

      setSubmitting(false);
    },
    [stripe, elements, onSuccess]
  );

  const isLoading = submitting || externalLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 rounded-full border border-navy/15 px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-body-medium text-navy hover:bg-navy/5 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <Button
          type="submit"
          disabled={isLoading || !stripe}
          className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
}

type PaymentStepProps = {
  readonly amountCents: number;
  readonly description?: string;
  readonly onSuccess: (paymentIntentId: string) => void;
  readonly onBack: () => void;
};

export function PaymentStep({ amountCents, description, onSuccess, onBack }: PaymentStepProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function createIntent() {
      try {
        const res = await fetch("/api/stripe/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amountCents,
            ...(description ? { description } : {}),
          }),
        });
        const data = await res.json();
        if (!cancelled) {
          if (data.success) {
            setClientSecret(data.data.clientSecret);
          } else {
            setFetchError(data.error ?? "Unable to initialize payment.");
          }
        }
      } catch {
        if (!cancelled) setFetchError("Something went wrong.");
      }
    }

    createIntent();
    return () => { cancelled = true; };
  }, [amountCents, description]);

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);

  return (
    <div>
      <h2 className="text-2xl font-heading-medium text-navy mb-2">Payment</h2>
      <p className="text-sm text-navy/60 font-[family-name:var(--font-poppins)] mb-1">
        Enter your payment details to complete your order.
      </p>
      <p className="text-lg font-heading-medium text-navy mb-6">
        {formattedAmount}
      </p>

      {fetchError && (
        <div>
          <p className="mb-4 font-[family-name:var(--font-poppins)] text-sm text-red-600">
            {fetchError}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-full border border-navy/15 px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-body-medium text-navy hover:bg-navy/5 transition-colors"
          >
            Back
          </button>
        </div>
      )}

      {!clientSecret && !fetchError && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-navy/5" />
          ))}
        </div>
      )}

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: STRIPE_APPEARANCE }}
        >
          <PaymentForm onSuccess={onSuccess} onBack={onBack} />
        </Elements>
      )}
    </div>
  );
}
