"use client";

import { useState, useCallback, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/shared";

type Mode = "login" | "register";

interface AuthStepProps {
  readonly onComplete: () => void;
  readonly onBack: () => void;
}

export function AuthStep({ onComplete, onBack }: AuthStepProps) {
  const [mode, setMode] = useState<Mode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if already logged in
  useEffect(() => {
    async function check() {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          onComplete();
          return;
        }
      } catch {
        // Not logged in
      }
      setCheckingSession(false);
    }
    check();
  }, [onComplete]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, address, password }),
        });
        const data = await res.json();
        if (!data.success) {
          if (res.status === 409) {
            setError("Account already exists. Try logging in instead.");
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

      onComplete();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }, [mode, name, email, phone, address, password, onComplete]);

  if (checkingSession) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">
          Checking account...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <h2 className="font-heading-medium text-navy text-2xl uppercase text-center mb-2">
        {mode === "register" ? "Create your account" : "Welcome back"}
      </h2>
      <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 text-center mb-8">
        {mode === "register"
          ? "Quick sign-up so we can schedule your first pickup."
          : "Sign in to continue setting up your membership."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <>
            <div>
              <label htmlFor="join-name" className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70">
                Full name
              </label>
              <input
                id="join-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="join-phone" className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70">
                Phone
              </label>
              <input
                id="join-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                minLength={10}
                className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="join-address" className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70">
                Pickup address
              </label>
              <input
                id="join-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="123 Main St, Apt 4B, Brooklyn NY 11201"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="join-email" className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70">
            Email
          </label>
          <input
            id="join-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label htmlFor="join-password" className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70">
            Password
          </label>
          <input
            id="join-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Minimum 8 characters"
          />
        </div>

        {error && (
          <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "register"
              ? "Create Account & Continue"
              : "Sign In & Continue"}
        </Button>
      </form>

      <p className="mt-4 text-center font-[family-name:var(--font-poppins)] text-sm text-navy/50">
        {mode === "register" ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); }}
              className="text-primary font-body-medium hover:underline"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            New here?{" "}
            <button
              type="button"
              onClick={() => { setMode("register"); setError(null); }}
              className="text-primary font-body-medium hover:underline"
            >
              Create an account
            </button>
          </>
        )}
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full py-2 text-center font-[family-name:var(--font-poppins)] text-[13px] text-navy/40 hover:text-primary"
      >
        ← Back to plans
      </button>
    </div>
  );
}
