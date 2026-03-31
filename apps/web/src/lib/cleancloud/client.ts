import { CLEANCLOUD_CONFIG } from "./config";
import { CleanCloudApiError, CleanCloudHttpError } from "./errors";
import { waitForRateLimit } from "./rate-limiter";

type CleanCloudResponse = {
  readonly Success?: string;
  readonly Error?: string;
  readonly [key: string]: unknown;
};

export async function cleancloudRequest<T extends Record<string, unknown>>(
  endpoint: string,
  params: Record<string, unknown>
): Promise<T> {
  await waitForRateLimit();

  const body = {
    api_token: CLEANCLOUD_CONFIG.apiToken,
    ...params,
  };

  const response = await fetch(`${CLEANCLOUD_CONFIG.baseUrl}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new CleanCloudHttpError(response.status, response.statusText);
  }

  const data = (await response.json()) as CleanCloudResponse;

  if (data.Error) {
    throw new CleanCloudApiError(data.Error);
  }

  return data as unknown as T;
}
