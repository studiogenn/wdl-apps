"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { type MembershipTier } from "@/lib/stripe-config";
import { TierSelection } from "./TierSelection";
import { AuthStep } from "./AuthStep";
import { ScheduleStep } from "./ScheduleStep";
import { PaymentStep } from "./PaymentStep";

type Step = "tier" | "auth" | "schedule" | "payment";

export type CustomerProfile = {
  readonly isReturning: boolean;
  readonly name?: string;
  readonly address?: string;
  readonly routeId?: number;
  readonly routeName?: string;
  readonly preferences?: {
    readonly detergent: string | null;
    readonly bleach: string | null;
    readonly fabricSoftener: string | null;
    readonly dryerTemperature: string | null;
    readonly dryerSheets: string | null;
  };
  readonly hasSavedPayment?: boolean;
  readonly orderCount?: number;
  readonly lastOrderDate?: string | null;
};

export function JoinFunnel() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("tier");
  const [tier, setTier] = useState<MembershipTier>("weekly");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  const prefetchFired = useRef(false);

  // Fire both SetupIntent + profile prefetch in parallel after auth
  const prefetchAll = useCallback((selectedTier: MembershipTier) => {
    if (prefetchFired.current) return;
    prefetchFired.current = true;

    // SetupIntent
    fetch("/api/membership/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setup", tier: selectedTier }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setClientSecret(json.data.clientSecret);
        } else {
          setPaymentError(json.error ?? "Something went wrong");
        }
      })
      .catch(() => {
        setPaymentError("Unable to initialize payment.");
      });

    // Customer profile
    fetch("/api/account/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProfile(json.data);
        }
      })
      .catch(() => {
        // Profile unavailable — proceed as new customer
        setProfile({ isReturning: false });
      });
  }, []);

  const handleTierSelect = useCallback((selected: MembershipTier) => {
    setTier(selected);
    setStep("auth");
    window.scrollTo(0, 0);
  }, []);

  const handleAuthComplete = useCallback(() => {
    prefetchAll(tier);
    setStep("schedule");
    window.scrollTo(0, 0);
  }, [tier, prefetchAll]);

  const handleScheduleComplete = useCallback(() => {
    setStep("payment");
    window.scrollTo(0, 0);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    router.push("/join/success");
  }, [router]);

  const stepIndex = step === "tier" ? 0 : step === "auth" ? 1 : step === "schedule" ? 2 : 3;

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100dvh - var(--header-height))" }}>
      <div className="flex-1 flex flex-col justify-center bg-cream">
        {step === "tier" && (
          <TierSelection selected={tier} onSelect={handleTierSelect} />
        )}

        {step === "auth" && (
          <AuthStep
            onComplete={handleAuthComplete}
            onBack={() => { setStep("tier"); window.scrollTo(0, 0); }}
          />
        )}

        {step === "schedule" && (
          <ScheduleStep
            tier={tier}
            profile={profile}
            onComplete={handleScheduleComplete}
            onBack={() => { setStep("auth"); window.scrollTo(0, 0); }}
          />
        )}

        {step === "payment" && (
          <PaymentStep
            tier={tier}
            profile={profile}
            clientSecret={clientSecret}
            fetchError={paymentError}
            onSuccess={handlePaymentSuccess}
            onBack={() => { setStep("schedule"); window.scrollTo(0, 0); }}
          />
        )}
      </div>

      {/* Progress */}
      <div className="bg-white border-t border-navy/10 px-6 py-3 shrink-0">
        <div className="mx-auto max-w-lg">
          <div className="flex gap-1.5">
            {["Plan", "Account", "Schedule", "Payment"].map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1 rounded-full transition-colors ${
                    i <= stepIndex ? "bg-primary" : "bg-navy/10"
                  }`}
                />
                <p
                  className={`mt-1 text-[11px] font-[family-name:var(--font-poppins)] ${
                    i <= stepIndex ? "text-primary font-body-medium" : "text-navy/30"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
