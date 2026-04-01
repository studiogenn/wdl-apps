"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

type PostHogProviderProps = {
  readonly children: React.ReactNode;
};

const BOT_PATTERN =
  /bot|crawl|spider|slurp|headlesschrome|phantomjs|puppeteer|selenium|playwright|lighthouse|pagespeed/i;

function isBot(): boolean {
  const ua = navigator.userAgent || "";
  return !ua || ua.length < 10 || navigator.webdriver || BOT_PATTERN.test(ua);
}

function PostHogIdentify() {
  const ph = usePostHog();

  useEffect(() => {
    if (!ph) return;

    authClient.getSession().then(({ data: session }) => {
      if (!session?.user) return;

      const user = session.user as Record<string, unknown>;
      const userId = user.id as string;
      const email = user.email as string;
      const name = user.name as string | undefined;
      const phone = user.phone as string | undefined;
      const cleancloudId = user.cleancloudCustomerId as number | undefined;
      const createdAt = user.createdAt as string | undefined;

      const personProps: Record<string, string | number> = { email };
      if (name) personProps.name = name;
      if (phone) personProps.phone = phone;
      if (cleancloudId) personProps.cleancloud_id = cleancloudId;
      if (createdAt) personProps.created_at = createdAt;

      ph.identify(userId, personProps);

      if (cleancloudId) {
        ph.alias(String(cleancloudId), userId);
      }
    }).catch(() => {
      // No session — user is anonymous, nothing to do
    });
  }, [ph]);

  return null;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;
    if (isBot()) return;

    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      capture_exceptions: true,
      session_recording: {
        recordCrossOriginIframes: true,
      },
    });

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
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogIdentify />
      {children}
    </PHProvider>
  );
}
