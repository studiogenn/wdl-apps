"use client";

import { useState } from "react";
import { LoginForm } from "@/components/account/login-form";
import { SignupForm } from "@/components/account/signup-form";
import { Dashboard } from "@/components/account/dashboard";

type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
};

type Props = {
  readonly user: User | null;
};

export function AccountDashboardClient({ user }: Props) {
  const [tab, setTab] = useState<"login" | "signup">("login");

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
