"use client";

import { useEffect } from "react";
import { Button } from "@/components/shared";
import { trackEvent } from "@/lib/tracking";

export default function Error({
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
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-heading-medium text-navy">
          Something went wrong
        </h1>
        <p className="mt-2 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
          {error.digest
            ? `Error ID: ${error.digest}`
            : "An unexpected error occurred."}
        </p>
        <div className="mt-6">
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}
