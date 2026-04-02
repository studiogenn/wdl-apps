"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

export default function CommercialError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    trackEvent("client_error", {
      error_message: error.message,
      error_digest: error.digest ?? "",
      page: window.location.pathname,
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-primary px-6">
      <div className="text-center">
        <h1 className="text-2xl font-heading-medium text-white">
          Something went wrong
        </h1>
        <p className="mt-2 font-[family-name:var(--font-poppins)] text-sm text-white/60">
          We couldn&apos;t load this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 font-[family-name:var(--font-inter)] rounded-full bg-highlight px-8 py-3 text-[13px] font-bold uppercase tracking-[1px] text-navy hover:bg-highlight/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
