"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { FLAG_KEYS } from "@/lib/feature-flags";
import { CleanCloudBooking } from "@/components/integrations/cleancloud-booking";
import { LoginForm } from "@/components/account/login-form";
import { SignupForm } from "@/components/account/signup-form";
import { Dashboard } from "@/components/account/dashboard";

type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
};

export function AccountPageClient() {
  const searchParams = useSearchParams();
  const flagEnabled = useFeatureFlagEnabled(FLAG_KEYS.NEW_ACCOUNT);
  const urlOverride = searchParams.get("flag") === "new-account";
  const newAccountEnabled = flagEnabled || urlOverride;
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!newAccountEnabled) {
      setChecked(true);
      return;
    }

    import("@/lib/auth-client").then(({ authClient }) =>
      authClient.getSession()
    ).then(({ data: session }) => {
      if (session?.user) {
        const u = session.user as Record<string, unknown>;
        setUser({
          id: u.id as string,
          name: u.name as string,
          email: u.email as string,
        });
      }
      setChecked(true);
    }).catch(() => {
      setChecked(true);
    });
  }, [newAccountEnabled]);

  if (!checked) return null;

  if (!newAccountEnabled) {
    return <CleanCloudBooking />;
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
