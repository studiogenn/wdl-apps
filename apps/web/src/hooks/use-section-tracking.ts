"use client";

import { useEffect, useRef } from "react";
import { trackSectionViewed } from "@/lib/tracking";

/**
 * Tracks when a section becomes visible in the viewport.
 * Fires the `section_viewed` event once per section per page load.
 */
export function useSectionTracking(sectionName: string) {
  const ref = useRef<HTMLElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || tracked.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackSectionViewed(sectionName);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionName]);

  return ref;
}
