"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/shared";
import { AddressInput } from "@/components/account/address-input";
import Link from "next/link";

type Mode = "login" | "register";

interface OrderAuthGateProps {
  readonly needsCleanCloud?: boolean;
}

export function OrderAuthGate({ needsCleanCloud }: OrderAuthGateProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(!needsCleanCloud);

  useEffect(() => {
    if (needsCleanCloud) return;
    async function check() {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          router.refresh();
          return;
        }
      } catch {
        // Not logged in
      }
      setCheckingSession(false);
    }
    check();
  }, [needsCleanCloud, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (needsCleanCloud) {
        const res = await fetch("/api/cleancloud/customers/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, address }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Could not set up your account.");
          setLoading(false);
          return;
        }
      } else if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, address, password }),
        });
        const data = await res.json();
        if (!data.success) {
          if (res.status === 409) {
            setError("Account already exists. Try logging in.");
            setMode("login");
          } else {
            setError(data.error ?? "Could not create account.");
          }
          setLoading(false);
          return;
        }
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error ?? "Invalid email or password.");
          setLoading(false);
          return;
        }
      }

      // Profile saved — redirect to dashboard where they can schedule or subscribe
      window.location.href = "/account?flag=new-account";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100dvh - var(--header-height))" }}>
        <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-5" style={{ minHeight: "calc(100dvh - var(--header-height))" }}>
      <div className="w-full max-w-md">
        <h1 className="font-heading-medium text-navy text-2xl uppercase text-center mb-1">
          {needsCleanCloud ? "Complete your profile" : mode === "register" ? "Create an account" : "Welcome back"}
        </h1>
        <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 text-center mb-6">
          {needsCleanCloud
            ? "We need your address to schedule pickups in your area."
            : "Sign in to schedule your Instant pickup at $2.95/lb."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {(mode === "register" || needsCleanCloud) && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full name"
                className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                minLength={10}
                placeholder="Phone number"
                className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <AddressInput
                value={address}
                onChange={(addr) => setAddress(addr)}
                onValidated={() => {}}
                onInvalid={() => {}}
              />
            </>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          {!needsCleanCloud && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Password"
              className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          )}

          {error && (
            <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600 text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : needsCleanCloud ? "Save & Continue" : mode === "register" ? "Create Account" : "Sign In"}
          </Button>
        </form>

        {!needsCleanCloud && (
          <p className="mt-4 text-center font-[family-name:var(--font-poppins)] text-sm text-navy/50">
            {mode === "register" ? (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => { setMode("login"); setError(null); }} className="text-primary font-body-medium hover:underline">
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button type="button" onClick={() => { setMode("register"); setError(null); }} className="text-primary font-body-medium hover:underline">
                  Create an account
                </button>
              </>
            )}
          </p>
        )}

        <p className="mt-6 text-center font-[family-name:var(--font-poppins)] text-xs text-navy/30">
          Want regular pickups?{" "}
          <Link href="/join" className="text-primary hover:underline">
            Join a membership from $139/mo →
          </Link>
        </p>
      </div>
    </div>
  );
}
