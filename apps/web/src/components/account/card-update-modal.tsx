"use client";

import { useState, useCallback } from "react";
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

type CardUpdateModalProps = {
  readonly onClose: () => void;
  readonly onSuccess: () => void;
};

function CardForm({ onClose, onSuccess }: CardUpdateModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setLoading(true);
      setError(null);

      const result = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      // Set as default payment method
      const pmId = result.setupIntent.payment_method;
      if (typeof pmId === "string") {
        try {
          await fetch("/api/stripe/default-payment-method", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentMethodId: pmId }),
          });
        } catch {
          // Non-critical — card is attached, just not set as default
        }
      }

      setLoading(false);
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
          disabled={loading || !stripe}
          className="flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Card"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function CardUpdateModal({ onClose, onSuccess }: CardUpdateModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch setup intent on mount
  useState(() => {
    (async () => {
      try {
        const res = await fetch("/api/stripe/setup-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
          setClientSecret(data.data.clientSecret);
        } else {
          setFetchError(data.error ?? "Unable to set up card update.");
        }
      } catch {
        setFetchError("Something went wrong.");
      }
    })();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-navy/10 bg-white p-8">
        <h3 className="mb-4 text-lg font-heading-medium text-navy">
          Update Payment Method
        </h3>

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
          <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">
            Loading...
          </p>
        )}

        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#1B3A5C",
                  borderRadius: "12px",
                  fontFamily: "DM Sans, system-ui, sans-serif",
                },
              },
            }}
          >
            <CardForm onClose={onClose} onSuccess={onSuccess} />
          </Elements>
        )}
      </div>
    </div>
  );
}
