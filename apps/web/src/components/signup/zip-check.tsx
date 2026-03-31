"use client";

import { useState } from "react";
import { z } from "zod";
import { trackSignupZipChecked } from "@/lib/tracking";

const zipSchema = z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid 5-digit zip code");

type ZipCheckProps = {
  readonly onSuccess: (routeID: number, zip: string) => void;
};

export function ZipCheck({ onSuccess }: ZipCheckProps) {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notInArea, setNotInArea] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotInArea(false);

    const result = zipSchema.safeParse(zip.trim());
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid zip code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cleancloud/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: result.data }),
      });
      const data = await res.json();

      if (data.success) {
        trackSignupZipChecked(result.data, true);
        onSuccess(data.data.routeID, result.data);
      } else {
        trackSignupZipChecked(result.data, false);
        setNotInArea(true);
      }
    } catch {
      setError("Unable to check your area. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-navy mb-2">Check Your Area</h2>
      <p className="text-sm text-navy/60 font-[family-name:var(--font-poppins)] mb-6">
        Enter your zip code to see if we deliver to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter zip code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/30 font-[family-name:var(--font-poppins)] text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 font-[family-name:var(--font-poppins)]">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !zip.trim()}
          className="w-full rounded-full bg-primary px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Checking..." : "Check Availability"}
        </button>
      </form>

      {notInArea && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800 mb-2">
            We don&apos;t serve your area yet.
          </p>
          <p className="text-xs text-amber-700 font-[family-name:var(--font-poppins)]">
            We&apos;re expanding quickly! Leave your email and we&apos;ll notify you when we arrive.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-3 flex gap-2"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-lg border border-amber-200 px-3 py-2 text-xs font-[family-name:var(--font-poppins)] focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              Notify Me
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
