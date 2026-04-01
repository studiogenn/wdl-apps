import { ButtonLink, SectionHeader } from "@/components/shared";

export default function SubscribeSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <SectionHeader
        heading="You're All Set"
        description="Your subscription is active. We'll handle the laundry from here."
        headingAs="h1"
      />

      <div className="rounded-xl border border-navy/10 bg-white p-8 text-center">
        <p className="mb-6 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
          Head to your dashboard to schedule your first pickup or manage your billing.
        </p>
        <ButtonLink href="/account">
          Go to Dashboard
        </ButtonLink>
      </div>
    </div>
  );
}
