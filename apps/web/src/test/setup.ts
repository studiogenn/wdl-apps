import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// BlurFade and framer-motion useInView require IntersectionObserver
const IntersectionObserverMock = class {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

afterEach(() => {
  cleanup();
});
