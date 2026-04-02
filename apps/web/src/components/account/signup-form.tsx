"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared";
import { AddressInput } from "./address-input";

type SignupFormProps = {
  readonly onSwitchToLogin: () => void;
};

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [routeID, setRouteID] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const isValid =
    name.length > 0 &&
    email.includes("@") &&
    phone.replace(/\D/g, "").length >= 10 &&
    routeID !== null &&
    password.length >= 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAlreadyExists(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          password,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        const msg = data.error ?? "Could not create account.";
        setError(msg);
        setAlreadyExists(res.status === 409 || msg.toLowerCase().includes("already"));
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError("Unable to create account. Please try again.");
      setLoading(false);
    }
  }

  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-heading-medium text-navy">Create Account</h2>
      <p className="mb-6 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
        Sign up to schedule pickups and manage your laundry.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="signup-name"
            className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70"
          >
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70"
          >
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="signup-phone"
            className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70"
          >
            Phone
          </label>
          <input
            id="signup-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="(555) 555-5555"
            className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <AddressInput
          value={address}
          onChange={(addr) => {
            setAddress(addr);
            setRouteID(null);
          }}
          onValidated={(id) => setRouteID(id)}
          onInvalid={() => setRouteID(null)}
        />

        <div>
          <label
            htmlFor="signup-password"
            className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {password.length > 0 && password.length < 8 && (
            <p className="mt-1 font-[family-name:var(--font-poppins)] text-xs text-red-600">
              Password must be at least 8 characters
            </p>
          )}
        </div>

        {error && (
          <div>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600">{error}</p>
            {alreadyExists && !resetSent && (
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="font-[family-name:var(--font-poppins)] text-xs font-body-medium text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                  Sign in instead
                </button>
                <span className="font-[family-name:var(--font-poppins)] text-xs text-navy/30">or</span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await fetch("/api/cleancloud/customers/password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: email.trim() }),
                      });
                      setResetSent(true);
                    } catch { /* ignore */ }
                  }}
                  className="font-[family-name:var(--font-poppins)] text-xs text-navy/50 underline underline-offset-2 hover:text-primary"
                >
                  Reset password
                </button>
              </div>
            )}
            {resetSent && (
              <p className="mt-2 font-[family-name:var(--font-poppins)] text-xs text-navy/60">
                Reset link sent. Check your email.
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !isValid}
          className="w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-[family-name:var(--font-poppins)] text-xs font-body-medium text-primary underline underline-offset-2 hover:text-primary-hover"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}
