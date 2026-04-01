import { getSessionToken } from "@/lib/auth/client";
import type { ApiResponse } from "@wdl/api";

const BFF_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

type RequestOptions = {
  readonly method?: "GET" | "POST" | "PUT" | "DELETE";
  readonly body?: Record<string, unknown>;
  readonly authenticated?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, authenticated = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authenticated) {
    const token = await getSessionToken();
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BFF_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data.error ?? `Request failed with status ${response.status}`,
    };
  }

  return data as ApiResponse<T>;
}
