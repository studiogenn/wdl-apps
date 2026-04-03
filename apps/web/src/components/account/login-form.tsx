"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared";
import { authClient } from "@/lib/auth-client";

type LoginFormProps = {
  readonly onSwitchToSignup: () => void;
};

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (data.success) {
        router.refresh();
        return;
      }

      setError(data.error ?? "Invalid email or password.");
    } catch {
      setError("Unable to sign in. Please try again.");
    }

    setLoading(false);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetStatus("sending");

    try {
      const res = await fetch("/api/cleancloud/customers/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });
      const data = await res.json();
      setResetStatus(data.success ? "sent" : "error");
    } catch {
      setResetStatus("error");
    }
  }

  if (resetMode) {
    return (
      <div>
        <h2 className="mb-2 text-2xl font-heading-medium text-navy">Reset Password</h2>
        <p className="mb-6 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {resetStatus === "sent" ? (
          <div>
            <p className="mb-4 font-[family-name:var(--font-poppins)] text-sm text-navy">
              If an account exists for that email, a reset link has been sent. Check your inbox.
            </p>
            <button
              type="button"
              onClick={() => { setResetMode(false); setResetStatus("idle"); }}
              className="font-[family-name:var(--font-poppins)] text-xs font-body-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="reset-email"
                className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70"
              >
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {resetStatus === "error" && (
              <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600">
                Unable to send reset email. Please try again.
              </p>
            )}

            <Button
              type="submit"
              disabled={resetStatus === "sending" || !resetEmail.includes("@")}
              className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resetStatus === "sending" ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setResetMode(false); setResetStatus("idle"); }}
                className="font-[family-name:var(--font-poppins)] text-xs font-body-medium text-primary underline underline-offset-2 hover:text-primary-hover"
              >
                Back to sign in
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-heading-medium text-navy">Welcome Back</h2>
      <p className="mb-6 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
        Sign in to manage your account and schedule pickups.
      </p>

      <button
        type="button"
        onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/account" })}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy transition-colors hover:bg-navy/5"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.77z" /* cspell:disable-line */ />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-navy/10" />
        <span className="font-[family-name:var(--font-poppins)] text-xs text-navy/40">or</span>
        <div className="h-px flex-1 bg-navy/10" />
      </div>

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

        <Button
          type="submit"
          disabled={loading || !email.trim() || !password}
          className="w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => { setResetMode(true); setResetEmail(email); }}
            className="font-[family-name:var(--font-poppins)] text-xs text-navy/50 underline underline-offset-2 hover:text-primary"
          >
            Forgot password?
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
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
