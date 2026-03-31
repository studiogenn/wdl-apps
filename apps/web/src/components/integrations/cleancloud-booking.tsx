"use client";

import { useEffect, useRef } from "react";
import { trackBookingFormSubmitted } from "@/lib/tracking";

const CLEANCLOUD_CSS = "https://cleancloudapp.com/webapp/public/webapp/cleancloud.css";
const CLEANCLOUD_JS = "https://cleancloudapp.com/webapp/public/webapp/cleancloud.js";
const STORE_ID = 29313;

declare global {
  interface Window {
    CleanCloudWebApp?: (
      selector: string,
      storeId: number,
      options: { width: string; height: string }
    ) => void;
  }
}

export function CleanCloudBooking() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CLEANCLOUD_CSS;
    document.head.appendChild(link);

    // Load JS then initialize
    const script = document.createElement("script");
    script.src = CLEANCLOUD_JS;
    script.onload = () => {
      if (window.CleanCloudWebApp) {
        window.CleanCloudWebApp("#cleancloud-container", STORE_ID, {
          width: "auto",
          height: "100%",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  // Track when user reaches the booking page as a conversion signal
  useEffect(() => {
    trackBookingFormSubmitted("cleancloud_page_view");
  }, []);

  return (
    <div
      className="w-full overflow-auto"
      style={{ height: "calc(100dvh - var(--header-height, 4rem))" }}
    >
      <div id="cleancloud-container" className="h-full" />
    </div>
  );
}
