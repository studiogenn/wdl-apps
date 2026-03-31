"use client";

import { useState } from "react";
import { trackContactFormSubmit, identifyWithEmail } from "@/lib/tracking";

export function ContactForm({
  ctaText,
  calendarCtaText,
  vertical,
  location,
}: {
  ctaText: string;
  calendarCtaText: string;
  vertical: string;
  location: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const body = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      units: formData.get("units") as string,
      message: (formData.get("message") as string) || undefined,
      form_type: `commercial_${vertical}_${location}`,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setStatus("success");
        trackContactFormSubmit();
        identifyWithEmail(body.email, {
          name: `${body.first_name} ${body.last_name}`,
          phone: body.phone,
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <h3 className="text-xl font-semibold text-navy mb-3">Thank You!</h3>
        <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70">
          We&apos;ve received your message and will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          required
          className="font-[family-name:var(--font-poppins)] px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          required
          className="font-[family-name:var(--font-poppins)] px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="font-[family-name:var(--font-poppins)] w-full px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        className="font-[family-name:var(--font-poppins)] w-full px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary"
      />
      <select
        name="units"
        required
        className="font-[family-name:var(--font-poppins)] w-full px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary text-navy/70"
      >
        <option value="">Number of units</option>
        <option value="1-2">1-2 units</option>
        <option value="3-5">3-5 units</option>
        <option value="6-10">6-10 units</option>
        <option value="10+">10+ units</option>
      </select>
      <textarea
        name="message"
        placeholder="Neighborhoods, frequency, special requests..."
        rows={3}
        className="font-[family-name:var(--font-poppins)] w-full px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary resize-none"
      />
      <label className="flex items-start gap-3">
        <input type="checkbox" required className="mt-1" />
        <span className="font-[family-name:var(--font-poppins)] text-xs text-navy/60 leading-relaxed">
          By submitting this form, you agree to receive recurring automated marketing
          and informational text messages from We Deliver Laundry. Message frequency
          varies. Msg &amp; data rates may apply. Reply HELP for help or STOP to opt out.
        </span>
      </label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="font-[family-name:var(--font-inter)] w-full px-8 py-3 text-sm font-semibold text-navy bg-highlight rounded-full hover:bg-[#f5e8a0] transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : ctaText}
      </button>
      <a
        href="#"
        className="font-[family-name:var(--font-poppins)] block text-center text-sm text-navy/50 underline underline-offset-4 hover:text-navy/70"
      >
        {calendarCtaText}
      </a>
      {status === "error" && (
        <p className="text-red-500 text-sm text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
