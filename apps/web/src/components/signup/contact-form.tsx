"use client";

import { useState } from "react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(1, "Address is required"),
});

export type ContactInfo = z.infer<typeof contactSchema>;

type ContactFormProps = {
  readonly initialAddress?: string;
  readonly onSubmit: (info: ContactInfo) => void;
  readonly onBack: () => void;
  readonly loading?: boolean;
  readonly error?: string;
};

export function ContactForm({ initialAddress, onSubmit, onBack, loading, error }: ContactFormProps) {
  const [form, setForm] = useState<ContactInfo>({
    name: "",
    email: "",
    phone: "",
    address: initialAddress ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({});

  function handleChange(field: keyof ContactInfo, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = contactSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactInfo, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactInfo;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
  }

  const fields: ReadonlyArray<{
    key: keyof ContactInfo;
    label: string;
    type: string;
    placeholder: string;
    autoComplete: string;
  }> = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Jane Smith", autoComplete: "name" },
    { key: "email", label: "Email", type: "email", placeholder: "jane@example.com", autoComplete: "email" },
    { key: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567", autoComplete: "tel" },
    { key: "address", label: "Pickup Address", type: "text", placeholder: "123 Main St, Apt 4B", autoComplete: "street-address" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-navy mb-2">Your Info</h2>
      <p className="text-sm text-navy/60 font-[family-name:var(--font-poppins)] mb-6">
        Tell us where to pick up your laundry.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, label, type, placeholder, autoComplete }) => (
          <div key={key}>
            <label className="mb-1.5 block text-xs font-medium text-navy/70 font-[family-name:var(--font-poppins)]">
              {label}
            </label>
            <input
              type={type}
              autoComplete={autoComplete}
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-navy placeholder:text-navy/30 font-[family-name:var(--font-poppins)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors[key] ? "border-red-300 focus:border-red-400" : "border-navy/15 focus:border-primary"
              }`}
            />
            {errors[key] && (
              <p className="mt-1 text-xs text-red-600 font-[family-name:var(--font-poppins)]">{errors[key]}</p>
            )}
          </div>
        ))}

        {error && (
          <p className="text-sm text-red-600 font-[family-name:var(--font-poppins)]">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-full border border-navy/15 px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-semibold text-navy hover:bg-navy/5 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-full bg-primary px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
