"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { FLAG_KEYS } from "@/lib/feature-flags";
import { JoinFunnel } from "./JoinFunnel";

export function JoinGate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flagEnabled = useFeatureFlagEnabled(FLAG_KEYS.MEMBERSHIP_FUNNEL);
  const urlOverride = searchParams.get("flag") === "membership-funnel";

  // Still resolving
  if (flagEnabled === undefined && !urlOverride) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100dvh - var(--header-height))" }}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy/20 border-t-primary" />
      </div>
    );
  }

  // Flag off — redirect
  if (!flagEnabled && !urlOverride) {
    router.replace("/pricing");
    return null;
  }

  return <JoinFunnel />;
}
