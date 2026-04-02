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
  readonly onClose: () => void;
  readonly onSuccess: () => void;
};

function PaymentForm({ onClose, onSuccess }: PaymentFormProps) {
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

      setSubmitting(false);
      onSuccess();
    },
    [stripe, elements, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && (
        <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={submitting || !stripe}
          className="flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Processing..." : "Pay Now"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={submitting}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

type OrderPaymentModalProps = {
  readonly amountCents: number;
  readonly orderID: number;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
};

export function OrderPaymentModal({
  amountCents,
  orderID,
  onClose,
  onSuccess,
}: OrderPaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);

  useEffect(() => {
    let cancelled = false;

    async function createIntent() {
      try {
        const res = await fetch("/api/stripe/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amountCents,
            description: `Order #${orderID}`,
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
  }, [amountCents, orderID]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-navy/10 bg-white p-8">
        <h3 className="mb-1 text-lg font-heading-medium text-navy">
          Pay for Order #{orderID}
        </h3>
        <p className="mb-4 text-lg font-heading-medium text-navy">
          {formattedAmount}
        </p>

        {fetchError && (
          <div>
            <p className="mb-4 font-[family-name:var(--font-poppins)] text-sm text-red-600">
              {fetchError}
            </p>
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
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
            <PaymentForm onClose={onClose} onSuccess={onSuccess} />
          </Elements>
        )}
      </div>
    </div>
  );
}
