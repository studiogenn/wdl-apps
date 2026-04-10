"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, ButtonLink } from "@/components/shared";

type Mode = "check" | "prompt" | "login" | "register" | "done";

export function PostCheckoutAccountPrompt() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("check");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          setMode("done");
          return;
        }
      } catch {
        // Not logged in
      }
      setMode("prompt");
    }
    check();
  }, []);

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address, password }),
      });
      const data = await res.json();
      if (data.success) {
        setMode("done");
        router.refresh();
      } else {
        if (res.status === 409) {
          setError("Account already exists. Try signing in instead.");
          setMode("login");
        } else {
          setError(data.error ?? "Could not create account.");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }, [name, email, phone, address, password, router]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setMode("done");
        router.refresh();
      } else {
        setError(data.error ?? "Invalid email or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }, [email, password, router]);

  const handleForgotPassword = useCallback(async () => {
    if (!email.includes("@")) {
      setError("Enter your email above first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await fetch("/api/cleancloud/customers/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setError("Reset link sent! Check your email, then come back and sign in.");
    } catch {
      setError("Unable to send reset email. Contact start@wedeliverlaundry.com");
    }
    setLoading(false);
  }, [email]);

  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  const inputClass = "w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
  const labelClass = "mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70";

  if (mode === "check") return null;

  if (mode === "done") {
    return (
      <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-green-700 mb-3">
          Your account is set up
        </p>
        <p className="font-[family-name:var(--font-poppins)] text-xs text-green-600/70 mb-4">
          You can manage your subscription, schedule pickups, and view invoices from your dashboard.
        </p>
        <ButtonLink href="/account" className="inline-flex">
          Go to My Account
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy text-center mb-1">
        Before you go...
      </p>
      <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/60 text-center mb-5">
        Create an account to manage your subscription, schedule pickups, and view invoices.
      </p>

      {mode === "prompt" && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => setMode("register")}>
            Create Account
          </Button>
          <Button variant="outline" onClick={() => setMode("login")}>
            I Already Have an Account
          </Button>
        </div>
      )}

      {mode === "register" && (
        <form onSubmit={handleRegister} className="space-y-3 max-w-sm mx-auto">
          <div>
            <label htmlFor="post-name" className={labelClass}>Full name</label>
            <input id="post-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Doe" className={inputClass} />
          </div>
          <div>
            <label htmlFor="post-phone" className={labelClass}>Phone</label>
            <input id="post-phone" type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} required minLength={10} placeholder="(555) 123-4567" className={inputClass} />
          </div>
          <div>
            <label htmlFor="post-address" className={labelClass}>Pickup address</label>
            <input id="post-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="123 Main St, Brooklyn NY 11201" className={inputClass} />
          </div>
          <div>
            <label htmlFor="post-email" className={labelClass}>Email</label>
            <input id="post-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@example.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="post-password" className={labelClass}>Password</label>
            <input id="post-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters" className={inputClass} />
          </div>
          {error && <p className="font-[family-name:var(--font-poppins)] text-xs text-red-600 text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
          <p className="text-center font-[family-name:var(--font-poppins)] text-xs text-navy/50">
            Already have an account?{" "}
            <button type="button" onClick={() => { setMode("login"); setError(null); }} className="text-primary font-body-medium hover:underline">
              Sign in
            </button>
          </p>
        </form>
      )}

      {mode === "login" && (
        <form onSubmit={handleLogin} className="space-y-3 max-w-sm mx-auto">
          <div>
            <label htmlFor="post-login-email" className={labelClass}>Email</label>
            <input id="post-login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@example.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="post-login-password" className={labelClass}>Password</label>
            <input id="post-login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Your password" className={inputClass} />
          </div>
          {error && <p className="font-[family-name:var(--font-poppins)] text-xs text-red-600 text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="flex justify-between">
            <button type="button" onClick={() => { setMode("register"); setError(null); }} className="font-[family-name:var(--font-poppins)] text-xs text-primary font-body-medium hover:underline">
              Create account
            </button>
            <button type="button" onClick={handleForgotPassword} className="font-[family-name:var(--font-poppins)] text-xs text-navy/50 underline underline-offset-2 hover:text-primary">
              Forgot password?
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
