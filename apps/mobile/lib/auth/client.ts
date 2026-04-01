import { createAuthClient } from "better-auth/client";
import * as SecureStore from "expo-secure-store";

const SESSION_TOKEN_KEY = "better-auth-session";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/auth`,
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => SecureStore.getItem(SESSION_TOKEN_KEY) ?? undefined,
    },
    onResponse: async (context) => {
      const setCookie = context.response.headers.get("set-cookie");
      if (setCookie) {
        const tokenMatch = setCookie.match(
          /better-auth\.session_token=([^;]+)/
        );
        if (tokenMatch?.[1]) {
          const token = decodeURIComponent(tokenMatch[1]);
          await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
        }
      }
    },
  },
});

export async function getSessionToken(): Promise<string | null> {
  return SecureStore.getItem(SESSION_TOKEN_KEY);
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}
