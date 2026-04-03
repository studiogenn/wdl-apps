"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { FLAG_KEYS } from "@/lib/feature-flags";
import { CleanCloudBooking } from "@/components/integrations/cleancloud-booking";
import { LoginForm } from "@/components/account/login-form";
import { SignupForm } from "@/components/account/signup-form";
import { CompleteProfileForm } from "@/components/account/complete-profile-form";
import { Dashboard } from "@/components/account/dashboard";

type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string | null;
};

type Props = {
  readonly user: User | null;
};

export function AccountPageClient({ user }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flagEnabled = useFeatureFlagEnabled(FLAG_KEYS.NEW_ACCOUNT);
  const urlOverride = searchParams.get("flag") === "new-account";
  const fromCheckout = searchParams.get("checkout") === "success";
  const newAccountEnabled = flagEnabled || urlOverride || fromCheckout;
  const [tab, setTab] = useState<"login" | "signup">("login");

  if (!newAccountEnabled) {
    return <CleanCloudBooking />;
  }

  if (user && !user.phone) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-navy/10 bg-white p-8">
          <CompleteProfileForm user={user} onComplete={() => router.refresh()} />
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} />;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-navy/10 bg-white p-8">
        {tab === "login" ? (
          <LoginForm onSwitchToSignup={() => setTab("signup")} />
        ) : (
          <SignupForm onSwitchToLogin={() => setTab("login")} />
        )}
      </div>
    </div>
  );
}
