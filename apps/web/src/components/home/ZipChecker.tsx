"use client";

import { useState } from "react";
import Link from "next/link";
import { trackSignupZipChecked } from "@/lib/tracking";

type Status = "idle" | "loading" | "served" | "not_served" | "error";

export function ZipChecker() {
  const [zip, setZip] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyStatus, setNotifyStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    const trimmed = zip.trim();
    if (!/^\d{5}$/.test(trimmed)) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/cleancloud/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: trimmed }),
      });
      const data = await res.json();
      setStatus(data.success ? "served" : "not_served");
      trackSignupZipChecked(trimmed, data.success);
    } catch {
      setStatus("error");
    }
  }

  if (status === "served") {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-6 py-3 mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-green-700">
            We deliver to {zip}!
          </span>
        </div>
        <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60 mb-4">
          Schedule your first pickup today.
        </p>
        <Link
          href="/account/"
          className="font-[family-name:var(--font-inter)] inline-block px-8 py-3 text-sm font-body-medium text-white bg-primary rounded-full hover:bg-primary-hover transition-colors"
        >
          Schedule Pick-up
        </Link>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="Enter your zip code"
          value={zip}
          onChange={(e) => {
            setZip(e.target.value.replace(/\D/g, ""));
            if (status !== "idle" && status !== "loading") setStatus("idle");
          }}
          className="font-[family-name:var(--font-poppins)] flex-1 px-5 py-3 text-sm border border-navy/20 rounded-full focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={status === "loading" || zip.trim().length < 5}
          className="font-[family-name:var(--font-inter)] px-8 py-3 text-sm font-body-medium text-white bg-primary rounded-full hover:bg-primary-hover transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Checking..." : "Check Zip Code"}
        </button>
      </form>

      {status === "not_served" && (
        <div className="mt-4 text-center">
          <p className="font-[family-name:var(--font-poppins)] text-sm text-amber-700 mb-3">
            We don&apos;t serve {zip} yet, but we&apos;re expanding quickly!
          </p>
          {notifyStatus === "sent" ? (
            <p className="font-[family-name:var(--font-poppins)] text-sm text-green-700">
              We&apos;ll notify you when we reach your area.
            </p>
          ) : (
            <form
              onSubmit={async (e: { preventDefault: () => void }) => {
                e.preventDefault();
                if (!notifyEmail.trim()) return;
                setNotifyStatus("sending");
                try {
                  await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      first_name: "Expansion Interest",
                      last_name: zip,
                      email: notifyEmail.trim(),
                      form_type: "expansion_interest",
                      message: `Interested in service for zip code ${zip}`,
                    }),
                  });
                  setNotifyStatus("sent");
                } catch {
                  setNotifyStatus("idle");
                }
              }}
              className="flex gap-2 max-w-sm mx-auto"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="font-[family-name:var(--font-poppins)] flex-1 px-4 py-2.5 text-sm border border-amber-200 rounded-full focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={notifyStatus === "sending"}
                className="font-[family-name:var(--font-inter)] px-5 py-2.5 text-sm font-body-medium text-white bg-amber-600 rounded-full hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {notifyStatus === "sending" ? "..." : "Notify Me"}
              </button>
            </form>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 text-center">
          <p className="font-[family-name:var(--font-poppins)] text-sm text-red-600">
            Unable to check your area. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}
