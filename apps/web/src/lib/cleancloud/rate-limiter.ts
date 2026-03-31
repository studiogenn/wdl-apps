const MIN_INTERVAL_MS = 334; // ~3 requests per second
let lastRequestTime = 0;

export async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;

  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS - elapsed));
  }

  lastRequestTime = Date.now();
}
