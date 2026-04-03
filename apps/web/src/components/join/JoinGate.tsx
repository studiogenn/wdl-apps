"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { FLAG_KEYS } from "@/lib/feature-flags";
import { JoinFunnel } from "./JoinFunnel";

export function JoinGate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flagEnabled = useFeatureFlagEnabled(FLAG_KEYS.MEMBERSHIP_FUNNEL);
  const urlOverride = searchParams.get("flag") === "membership-funnel";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for PostHog to resolve the flag
    if (flagEnabled === undefined && !urlOverride) return;

    if (flagEnabled || urlOverride) {
      setReady(true);
    } else {
      router.replace("/pricing");
    }
  }, [flagEnabled, urlOverride, router]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100dvh - var(--header-height))" }}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy/20 border-t-primary" />
      </div>
    );
  }

  return <JoinFunnel />;
}
