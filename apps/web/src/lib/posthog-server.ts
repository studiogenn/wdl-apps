import { PostHog } from "posthog-node";

let client: PostHog | null = null;

export function getPostHogServer(): PostHog {
  if (client) return client;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_POSTHOG_KEY environment variable");
  }

  client = new PostHog(apiKey, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  });

  return client;
}
