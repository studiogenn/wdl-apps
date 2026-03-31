"use client";

import { useCallback, useState } from "react";
import posthog from "posthog-js";

type EarlyAccessOptOutProps = {
  readonly featureKey: string;
};

export function EarlyAccessOptOut({ featureKey }: EarlyAccessOptOutProps) {
  const [leaving, setLeaving] = useState(false);

  const handleOptOut = useCallback(() => {
    if (!posthog.__loaded) return;
    setLeaving(true);

    // Set cookie immediately so the middleware sees the change on reload
    // (PostHog server-side ingestion is too slow for the reload race)
    document.cookie = `wdl_ea_${featureKey}=false; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    posthog.capture("$feature_enrollment_update", {
      $feature_flag: featureKey,
      $feature_enrollment: false,
      $set: { [`$feature_enrollment/${featureKey}`]: false },
    });
    posthog.setPersonProperties({
      [`$feature_enrollment/${featureKey}`]: false,
    });

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }, [featureKey]);

  return (
    <div className="border-b border-fresh-lemon-200/30 bg-fresh-lemon-200/10 px-6 py-3 text-center text-sm">
      <span className="font-body-medium text-detergent-700">
        You&apos;re using the new account experience.
      </span>
      <button
        onClick={handleOptOut}
        disabled={leaving}
        className="ml-2 text-neutral-500 underline underline-offset-2 transition-colors hover:text-detergent-700 disabled:opacity-50"
      >
        {leaving ? "Switching..." : "Switch back"}
      </button>
    </div>
  );
}
