"use client";

import { useState, useCallback } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getStripePromise } from "@/lib/stripe-client";
import { Button } from "@/components/shared";

type OrderState =
  | { readonly step: "enter-amount" }
  | { readonly step: "collecting-card"; readonly clientSecret: string; readonly paymentIntentId: string }
  | { readonly step: "processing"; readonly clientSecret: string; readonly paymentIntentId: string }
  | { readonly step: "success"; readonly paymentIntentId: string }
  | { readonly step: "error"; readonly message: string };

function AmountStep({
  onCreated,
}: {
  readonly onCreated: (clientSecret: string, paymentIntentId: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const dollars = parseFloat(amount);
      if (Number.isNaN(dollars) || dollars < 1) {
        setError("Enter an amount of at least $1.00");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/stripe/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amountCents: Math.round(dollars * 100),
            description: "Single laundry order",
          }),
        });

        const data = await res.json();

        if (!data.success) {
          setError(data.error ?? "Failed to create order");
          setLoading(false);
          return;
        }

        onCreated(data.data.clientSecret, data.data.paymentIntentId);
      } catch {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    },
    [amount, onCreated],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="order-amount"
          className="block font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy"
        >
          Estimate
        </label>
        <p className="mt-1 font-[family-name:var(--font-poppins)] text-xs text-navy/50">
          This is the pre-authorized amount. You will only be charged for the actual weight of your
          laundry.
        </p>
        <div className="relative mt-3">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-[family-name:var(--font-poppins)] text-sm text-navy/40">
            $
          </span>
          <input
            id="order-amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-navy/10 bg-white py-3 pl-8 pr-4 font-[family-name:var(--font-poppins)] text-sm text-navy outline-none transition-colors placeholder:text-navy/30 focus:border-primary focus:ring-1 focus:ring-primary"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating order..." : "Continue to Payment"}
      </Button>
    </form>
  );
}

function CardStep({
  onSuccess,
  onError,
  onProcessing,
}: {
  readonly onSuccess: () => void;
  readonly onError: (message: string) => void;
  readonly onProcessing: () => void;
}) {
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
      onProcessing();

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/account/order?status=success`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        const msg = result.error.message ?? "Payment failed. Please try again.";
        setError(msg);
        onError(msg);
        setLoading(false);
        return;
      }

      onSuccess();
    },
    [stripe, elements, onSuccess, onError, onProcessing],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading || !stripe}>
        {loading ? "Processing..." : "Authorize Payment"}
      </Button>
    </form>
  );
}

export function OrderForm() {
  const [state, setState] = useState<OrderState>({ step: "enter-amount" });

  const handleCreated = useCallback((clientSecret: string, paymentIntentId: string) => {
    setState({ step: "collecting-card", clientSecret, paymentIntentId });
  }, []);

  const handleProcessing = useCallback(() => {
    setState((prev) => {
      if (prev.step === "collecting-card") {
        return { step: "processing", clientSecret: prev.clientSecret, paymentIntentId: prev.paymentIntentId };
      }
      return prev;
    });
  }, []);

  const handleSuccess = useCallback(() => {
    setState((prev) => {
      if (prev.step === "processing" || prev.step === "collecting-card") {
        return { step: "success", paymentIntentId: prev.paymentIntentId };
      }
      return prev;
    });
  }, []);

  const handleError = useCallback((message: string) => {
    setState((prev) => {
      if (prev.step === "collecting-card" || prev.step === "processing") {
        return { step: "collecting-card", clientSecret: prev.clientSecret, paymentIntentId: prev.paymentIntentId };
      }
      return { step: "error", message };
    });
  }, []);

  const handleReset = useCallback(() => {
    setState({ step: "enter-amount" });
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-heading-medium text-navy">Place an Order</h1>
      <p className="mt-2 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
        Enter your estimated laundry amount. Your card will be pre-authorized and only charged for
        the actual weight.
      </p>

      <div className="mt-8 rounded-xl border border-navy/10 bg-white p-6">
        {state.step === "enter-amount" && <AmountStep onCreated={handleCreated} />}

        {(state.step === "collecting-card" || state.step === "processing") && (
          <Elements
            stripe={getStripePromise()}
            options={{
              clientSecret: state.clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#050B39",
                  fontFamily: "DM Sans, sans-serif",
                  borderRadius: "8px",
                },
              },
            }}
          >
            <CardStep
              onSuccess={handleSuccess}
              onError={handleError}
              onProcessing={handleProcessing}
            />
          </Elements>
        )}

        {state.step === "success" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-xl font-heading-medium text-navy">Order Placed</h2>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
              Your payment has been pre-authorized. We&apos;ll charge only for the actual weight of
              your laundry.
            </p>
            <Button variant="outline" onClick={handleReset} className="mt-4">
              Place Another Order
            </Button>
          </div>
        )}

        {state.step === "error" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-heading-medium text-navy">Something Went Wrong</h2>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
              {state.message}
            </p>
            <Button variant="outline" onClick={handleReset} className="mt-4">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
