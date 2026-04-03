import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/button-link";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Welcome to WDL — You're In",
};

export default function JoinSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <SectionHeader
        eyebrow="You're in"
        heading="Welcome to We Deliver Laundry"
        description="Your membership is active. Here's what happens next."
        headingAs="h1"
      />

      <div className="rounded-2xl border border-navy/10 bg-white p-8 space-y-6">
        <div className="space-y-4">
          <h3 className="font-heading-medium text-navy text-lg">What to know</h3>
          <ul className="space-y-3">
            {[
              "Leave your bag at the door during your scheduled pickup window",
              "We wash, dry, and fold everything — no sorting needed from you",
              "Clean clothes returned within 24 hours of pickup",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 font-[family-name:var(--font-poppins)] text-sm text-navy/70"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary mt-0.5">
                  &#10003;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <ButtonLink href="/account">Go to Dashboard</ButtonLink>
          <ButtonLink href="/" variant="outline">Back to Home</ButtonLink>
        </div>
      </div>
    </div>
  );
}
