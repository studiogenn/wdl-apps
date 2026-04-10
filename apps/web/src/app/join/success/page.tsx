import type { Metadata } from "next";
import { PostCheckoutAccountPrompt } from "@/components/account/post-checkout-prompt";

export const metadata: Metadata = {
  title: "Welcome to WDL — You're In",
};

export default function JoinSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12" style={{ minHeight: "calc(100dvh - var(--header-height))" }}>
      {/* Checkmark */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-200 mb-6">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M7.5 14l5 5 8-9" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="font-heading-medium text-navy text-2xl uppercase text-center mb-2">
        You&apos;re in
      </h1>
      <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 text-center mb-4 max-w-sm">
        Your membership is active. Your first pickup is just a few clicks away.
      </p>

      <div className="w-full max-w-md">
        <PostCheckoutAccountPrompt />
      </div>
    </div>
  );
}
