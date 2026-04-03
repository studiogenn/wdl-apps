"use client";

import { useState } from "react";
import { Button } from "@/components/shared";
import { AddressInput } from "./address-input";

type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
};

type Props = {
  readonly user: User;
  readonly onComplete: () => void;
};

export function CompleteProfileForm({ user, onComplete }: Props) {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [routeID, setRouteID] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = phone.replace(/\D/g, "").length >= 10 && routeID !== null;

  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Could not update profile.");
        setLoading(false);
        return;
      }
      onComplete();
    } catch {
      setError("Unable to save. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-heading-medium text-navy">
        Complete Your Profile
      </h2>
      <p className="mb-6 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
        Welcome, {user.name}! We need a couple more details to schedule your pickups.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="profile-phone"
            className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70"
          >
            Phone
          </label>
          <input
            id="profile-phone"
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

        {error && (
          <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || !isValid}
          className="w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
