"use client";

import { useCallback, useState } from "react";
import posthog from "posthog-js";

type EarlyAccessBannerProps = {
  readonly featureKey: string;
  readonly label: string;
};

export function EarlyAccessBanner({ featureKey, label }: EarlyAccessBannerProps) {
  const [enrolling, setEnrolling] = useState(false);

  const handleOptIn = useCallback(() => {
    if (!posthog.__loaded) return;
    setEnrolling(true);

    // Set cookie immediately so the middleware sees the change on reload
    // (PostHog server-side ingestion is too slow for the reload race)
    document.cookie = `wdl_ea_${featureKey}=true; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    posthog.capture("$feature_enrollment_update", {
      $feature_flag: featureKey,
      $feature_enrollment: true,
      $set: { [`$feature_enrollment/${featureKey}`]: true },
    });
    posthog.setPersonProperties({
      [`$feature_enrollment/${featureKey}`]: true,
    });

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }, [featureKey]);

  return (
    <div className="border-b border-wdl-accent/30 bg-wdl-accent/10 px-6 py-3 text-center text-sm">
      <span className="text-wdl-muted">{label}</span>
      <button
        onClick={handleOptIn}
        disabled={enrolling}
        className="ml-2 font-medium text-wdl-dark underline underline-offset-2 transition-colors hover:text-wdl-primary disabled:opacity-50"
      >
        {enrolling ? "Switching..." : "Try it now"}
      </button>
    </div>
  );
}
