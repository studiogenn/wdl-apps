"use client";

import posthog from "posthog-js";
import type { JsonType } from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

declare global {
  interface Window {
    __ab_pageview_fired?: boolean;
  }
}

const VARIANT_LABELS: Readonly<Record<string, string>> = {
  control: "Control (Old Site)",
  cache: "Old Site + Cache",
  "new-site": "New Site",
};

type PostHogProviderProps = {
  readonly children: React.ReactNode;
  readonly visitorId?: string;
  readonly abVariant?: string;
  readonly bootstrapFlags?: Record<string, string | boolean>;
  readonly bootstrapPayloads?: Record<string, JsonType>;
};

function PostHogPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!posthog.__loaded || !pathname) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Provider useEffect fires the initial pageview with variant attribution.
      // Only fire here as fallback for direct Vercel access (no CF worker).
      if (window.__ab_pageview_fired) return;
    }

    // SPA route change (or fallback first pageview)
    const url = searchParams?.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    posthog.capture("$pageview", {
      $current_url: window.location.origin + url,
    });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({
  children,
  visitorId,
  abVariant,
  bootstrapFlags,
  bootstrapPayloads,
}: PostHogProviderProps) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;

    // Skip PostHog init for bots
    const ua = navigator.userAgent || "";
    if (!ua || ua.length < 10 || navigator.webdriver ||
      /bot|crawl|spider|slurp|headlesschrome|phantomjs|puppeteer|selenium|playwright|lighthouse|pagespeed/i.test(ua)) {
      return;
    }

    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      advanced_disable_feature_flags_on_first_load: true,
      session_recording: {
        recordCrossOriginIframes: true,
      },
      bootstrap: {
        distinctID: visitorId,
        featureFlags: bootstrapFlags,
        featureFlagPayloads: bootstrapPayloads,
      },
    });

    // Link existing PostHog identity to CF worker's visitor ID
    if (visitorId && posthog.get_distinct_id() !== visitorId) {
      posthog.identify(visitorId);
    }

    // Register A/B variant as super property + person property
    if (abVariant) {
      const label = VARIANT_LABELS[abVariant] || abVariant;
      posthog.register({ ab_variant: abVariant, ab_variant_label: label });
      posthog.capture("$pageview");
      window.__ab_pageview_fired = true;
      posthog.setPersonProperties({ ab_variant: abVariant });
    }

    // Set person properties for experiment segmentation
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");

    posthog.setPersonPropertiesForFlags({
      $initial_referrer: document.referrer || "direct",
      device_type: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
      ...(utmSource && { utm_source: utmSource }),
      ...(utmMedium && { utm_medium: utmMedium }),
      ...(utmCampaign && { utm_campaign: utmCampaign }),
    });
  }, [visitorId, abVariant, bootstrapFlags, bootstrapPayloads]);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
