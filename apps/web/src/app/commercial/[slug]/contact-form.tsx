"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const LBS_OPTIONS = [
  { value: "under_50", label: "Under 50 lbs" },
  { value: "50_200", label: "50–200 lbs" },
  { value: "200_500", label: "200–500 lbs" },
  { value: "500_plus", label: "500+ lbs" },
] as const;

const leadSchema = z.object({
  contact_name: z.string().min(1, "Name is required"),
  company_name: z.string().min(1, "Company name is required"),
  email: z.string().email("Please enter a valid email"),
  location: z.string().min(1, "Location is required"),
  lbs_per_week: z.enum(["under_50", "50_200", "200_500", "500_plus"], "Please select your estimated volume"),
});

type LeadForm = z.infer<typeof leadSchema>;
type FormErrors = Partial<Record<keyof LeadForm, string>>;

export function ContactForm({ vertical }: { readonly vertical?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<LeadForm>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(field: keyof LeadForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = leadSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LeadForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/commercial/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, vertical }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/commercial/thank-you");
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const TEXT_FIELDS: ReadonlyArray<{
    key: keyof LeadForm;
    label: string;
    type: string;
    placeholder: string;
    autoComplete: string;
  }> = [
    { key: "contact_name", label: "Your Name", type: "text", placeholder: "Jane Smith", autoComplete: "name" },
    { key: "company_name", label: "Company Name", type: "text", placeholder: "Acme Hotels", autoComplete: "organization" },
    { key: "email", label: "Email", type: "email", placeholder: "jane@acmehotels.com", autoComplete: "email" },
    { key: "location", label: "Location", type: "text", placeholder: "Manhattan, NY", autoComplete: "address-level2" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {TEXT_FIELDS.map(({ key, label, type, placeholder, autoComplete }) => (
        <div key={key}>
          <label className="mb-1.5 block font-[family-name:var(--font-poppins)] text-[11px] font-bold uppercase tracking-[1.5px] text-white/60">
            {label}
          </label>
          <input
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={form[key] ?? ""}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`w-full rounded-xl border bg-white/10 px-4 py-3 text-white placeholder:text-white/30 font-[family-name:var(--font-poppins)] text-sm focus:outline-none focus:ring-2 focus:ring-highlight/40 ${
              errors[key] ? "border-red-400" : "border-white/15 focus:border-highlight"
            }`}
          />
          {errors[key] && (
            <p className="mt-1 text-xs text-red-300 font-[family-name:var(--font-poppins)]">{errors[key]}</p>
          )}
        </div>
      ))}

      {/* lbs/week radio */}
      <div>
        <label className="mb-2 block font-[family-name:var(--font-poppins)] text-[11px] font-bold uppercase tracking-[1.5px] text-white/60">
          Estimated lbs / week
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LBS_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                form.lbs_per_week === value
                  ? "border-highlight bg-highlight/15 text-white"
                  : "border-white/15 bg-white/5 text-white/70 hover:border-white/30"
              }`}
            >
              <input
                type="radio"
                name="lbs_per_week"
                value={value}
                checked={form.lbs_per_week === value}
                onChange={(e) => handleChange("lbs_per_week", e.target.value)}
                className="sr-only"
              />
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  form.lbs_per_week === value ? "border-highlight" : "border-white/30"
                }`}
              >
                {form.lbs_per_week === value && (
                  <span className="h-2 w-2 rounded-full bg-highlight" />
                )}
              </span>
              <span className="font-[family-name:var(--font-poppins)] text-[13px]">{label}</span>
            </label>
          ))}
        </div>
        {errors.lbs_per_week && (
          <p className="mt-1 text-xs text-red-300 font-[family-name:var(--font-poppins)]">{errors.lbs_per_week}</p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-red-300 font-[family-name:var(--font-poppins)]">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="font-[family-name:var(--font-inter)] w-full rounded-full bg-highlight px-6 py-3.5 text-[13px] font-bold uppercase tracking-[1px] text-navy hover:bg-highlight/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending..." : "Get My Quote"}
      </button>

      <p className="font-[family-name:var(--font-poppins)] text-[10px] text-white/35 text-center">
        Free quote · Response within 24 hours · No obligation
      </p>
    </form>
  );
}
