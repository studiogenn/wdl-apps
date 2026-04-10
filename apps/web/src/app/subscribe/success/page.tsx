import { ButtonLink, SectionHeader } from "@/components/shared";
import { PostCheckoutAccountPrompt } from "@/components/account/post-checkout-prompt";

export default function SubscribeSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <SectionHeader
        heading="You're All Set"
        description="Your subscription is active. We'll handle the laundry from here."
        headingAs="h1"
      />

      <div className="rounded-xl border border-navy/10 bg-white p-8">
        <PostCheckoutAccountPrompt />
      </div>
    </div>
  );
}
