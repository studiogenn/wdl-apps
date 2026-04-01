/**
 * Floating banner shown when the site is being viewed in draft mode.
 * Server component -- self-hides when draft mode is not enabled.
 */

import { draftMode } from "next/headers";

export async function DraftBanner() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "10px 20px",
        backgroundColor: "rgba(30, 30, 30, 0.92)",
        color: "#f5f5f5",
        fontSize: "14px",
        fontFamily: "system-ui, sans-serif",
        backdropFilter: "blur(4px)",
      }}
    >
      <span>You are viewing a draft preview.</span>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- API route triggers side effect; Link would prefetch */}
      <a
        href="/api/draft/disable"
        style={{
          color: "#93c5fd",
          textDecoration: "underline",
          fontWeight: 500,
        }}
      >
        Exit Preview
      </a>
    </div>
  );
}
