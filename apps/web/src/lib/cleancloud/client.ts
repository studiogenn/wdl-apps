type ProxyResponse<T = Record<string, unknown>> = {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
};

const BEHEMOTH_URL = process.env.BEHEMOUTH_API_URL ?? "";
const PROXY_KEY = process.env.CLEANCLOUD_PROXY_API_KEY ?? "";

export async function cleancloudProxy<T = Record<string, unknown>>(
  path: string,
  params: Record<string, unknown> = {}
): Promise<ProxyResponse<T>> {
  if (!BEHEMOTH_URL) throw new Error("BEHEMOTH_API_URL not configured");
  if (!PROXY_KEY) throw new Error("CLEANCLOUD_PROXY_API_KEY not configured");

  const response = await fetch(`${BEHEMOTH_URL}/public/cleancloud${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": PROXY_KEY,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Proxy error: HTTP ${response.status}`);
  }

  return response.json() as Promise<ProxyResponse<T>>;
}
