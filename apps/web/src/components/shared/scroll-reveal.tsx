"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not(.revealed), [data-reveal-stagger]:not(.revealed)";

/**
 * Activates scroll-reveal animations on elements with `data-reveal` or
 * `data-reveal-stagger`. Uses MutationObserver to pick up new elements
 * added by client-side navigation.
 */
export function ScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    function observe(root: ParentNode) {
      root.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    }

    // Initial scan
    observe(document);

    // Watch for new elements (client-side nav)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.matches(SELECTOR)) io.observe(node);
            observe(node);
          }
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
