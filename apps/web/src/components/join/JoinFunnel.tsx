"use client";

import { useState, useCallback } from "react";
import { type MembershipTier } from "@/lib/stripe-config";
import { TierSelection } from "./TierSelection";
import { AuthStep } from "./AuthStep";
import { ScheduleStep } from "./ScheduleStep";

type Step = "tier" | "auth" | "schedule";

export function JoinFunnel() {
  const [step, setStep] = useState<Step>("tier");
  const [tier, setTier] = useState<MembershipTier>("standard");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleTierSelect = useCallback((selected: MembershipTier) => {
    setTier(selected);
    setStep("auth");
    window.scrollTo(0, 0);
  }, []);

  const handleAuthComplete = useCallback(() => {
    setStep("schedule");
    window.scrollTo(0, 0);
  }, []);

  const handleScheduleComplete = useCallback(async () => {
    setCheckoutError(null);
    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          successUrl: `${window.location.origin}/join/success`,
          cancelUrl: `${window.location.origin}/join`,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setCheckoutError(json.error ?? "Something went wrong");
        setCheckoutLoading(false);
        return;
      }

      window.location.href = json.data.url;
    } catch {
      setCheckoutError("Unable to start checkout. Please try again.");
      setCheckoutLoading(false);
    }
  }, [tier]);

  const stepIndex = step === "tier" ? 0 : step === "auth" ? 1 : 2;

  return (
    <div className="min-h-screen bg-cream">
      {/* Progress */}
      <div className="bg-white border-b border-navy/10 px-6 py-3">
        <div className="mx-auto max-w-lg">
          <div className="flex gap-1.5">
            {["Plan", "Account", "Schedule"].map((label, i) => (
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
          onComplete={handleScheduleComplete}
          onBack={() => { setStep("auth"); window.scrollTo(0, 0); }}
          loading={checkoutLoading}
          error={checkoutError}
        />
      )}
    </div>
  );
}
