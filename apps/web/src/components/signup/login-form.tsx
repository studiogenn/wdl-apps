"use client";

import { useState } from "react";
import { z } from "zod";
import { identifyCustomer, trackEvent } from "@/lib/tracking";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormProps = {
  readonly onSuccess: (customerID: number) => void;
  readonly onSwitchToSignup: () => void;
};

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = loginSchema.safeParse({ email: email.trim(), password });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cleancloud/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: result.data.email, password: result.data.password }),
      });
      const data = await res.json();

      if (data.success) {
        identifyCustomer({ customerId: data.data.customerID, email: result.data.email });
        trackEvent("cc_login", { customer_id: data.data.customerID });
        onSuccess(data.data.customerID);
      } else {
        setError(data.error ?? "Invalid email or password.");
      }
    } catch {
      setError("Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Enter your email above, then click forgot password.");
      return;
    }

    const emailResult = z.string().email().safeParse(email.trim());
    if (!emailResult.success) {
      setError("Please enter a valid email first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cleancloud/customers/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailResult.data }),
      });
      const data = await res.json();

      if (data.success) {
        setResetSent(true);
      } else {
        setError(data.error ?? "Unable to send reset email.");
      }
    } catch {
      setError("Unable to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-heading-medium text-navy">Welcome Back</h2>
      <p className="mb-6 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
        Sign in to schedule a pickup or manage your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {error && (
          <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600">{error}</p>
        )}

        {resetSent && (
          <p className="font-[family-name:var(--font-poppins)] text-sm text-green-600">
            Password reset email sent. Check your inbox.
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim() || !password}
          className="w-full rounded-full bg-primary px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-body-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={loading}
          className="font-[family-name:var(--font-poppins)] text-xs text-navy/50 underline underline-offset-2 hover:text-primary disabled:opacity-50"
        >
          Forgot password?
        </button>

        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-[family-name:var(--font-poppins)] text-xs font-body-medium text-primary underline underline-offset-2 hover:text-primary-hover"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
