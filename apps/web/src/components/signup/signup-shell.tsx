"use client";

import Image from "next/image";
import { StepIndicator } from "./step-indicator";

type SignupShellProps = {
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly stepLabels?: ReadonlyArray<string>;
  readonly showLogin?: boolean;
  readonly onToggleLogin?: () => void;
  readonly isLoginMode?: boolean;
  readonly children: React.ReactNode;
};

export function SignupShell({
  currentStep,
  totalSteps,
  stepLabels,
  showLogin = true,
  onToggleLogin,
  isLoginMode = false,
  children,
}: SignupShellProps) {
  return (
    <section className="min-h-[calc(100vh-4rem)] bg-cream px-5 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo/logo-full.png"
            alt="We Deliver Laundry"
            width={180}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        {showLogin && !isLoginMode && onToggleLogin && (
          <p className="mb-4 text-center font-[family-name:var(--font-poppins)] text-sm text-navy/60">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggleLogin}
              className="font-body-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              Sign in
            </button>
          </p>
        )}

        {!isLoginMode && (
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            labels={stepLabels}
          />
        )}

        <div className="rounded-2xl border border-navy/10 bg-white p-8">
          {children}
        </div>

        <p className="mt-6 text-center font-[family-name:var(--font-poppins)] text-xs text-navy/40">
          Questions? Call us at{" "}
          <a href="tel:8559685511" className="underline hover:text-primary">
            (855) 968-5511
          </a>
        </p>
      </div>
    </section>
  );
}
