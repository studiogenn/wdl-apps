"use client";

import { useState } from "react";
import { trackContactFormSubmit, identifyWithEmail } from "@/lib/tracking";

export function LocationForm({
  location,
  slug,
}: {
  location: string;
  slug: string;
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
      zip_code: (formData.get("zip_code") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
      form_type: "location_inquiry",
      form_id: `location-${slug}`,
      location,
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
        <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
          We&apos;ll be in touch within 24 hours to schedule your first pickup.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      id={`location-form-${slug}`}
      data-form-id={`location-${slug}`}
      className="bg-white rounded-2xl p-8 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          required
          className="w-full border border-primary/10 rounded-lg px-4 py-3 font-[family-name:var(--font-poppins)] text-[14px] text-navy placeholder:text-navy/50 outline-none focus:border-primary transition-colors"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          required
          className="w-full border border-primary/10 rounded-lg px-4 py-3 font-[family-name:var(--font-poppins)] text-[14px] text-navy placeholder:text-navy/50 outline-none focus:border-primary transition-colors"
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full border border-primary/10 rounded-lg px-4 py-3 font-[family-name:var(--font-poppins)] text-[14px] text-navy placeholder:text-navy/50 outline-none focus:border-primary transition-colors"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full border border-primary/10 rounded-lg px-4 py-3 font-[family-name:var(--font-poppins)] text-[14px] text-navy placeholder:text-navy/50 outline-none focus:border-primary transition-colors"
        />
        <input
          type="text"
          name="zip_code"
          placeholder="Zip Code"
          className="w-full border border-primary/10 rounded-lg px-4 py-3 font-[family-name:var(--font-poppins)] text-[14px] text-navy placeholder:text-navy/50 outline-none focus:border-primary transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-highlight text-primary font-bold text-[13px] uppercase tracking-[1.5px] py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Schedule My First Pickup"}
      </button>
      <p className="font-[family-name:var(--font-poppins)] text-[10px] text-navy/50 text-center">
        Free pickup · $1.95/lb weekly plan · No commitment required
      </p>
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
