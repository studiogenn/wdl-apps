"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function GlobalError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    try {
      posthog.capture("global_error", {
        error_message: error.message,
        error_digest: error.digest ?? "",
        page: window.location.pathname,
      });
    } catch {
      // PostHog not initialized — can't report
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#F7F5E6",
          color: "#050B39",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "0.875rem", opacity: 0.6, marginBottom: "1.5rem" }}>
            {error.digest ? `Error ID: ${error.digest}` : "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              backgroundColor: "#050B39",
              color: "#fff",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
