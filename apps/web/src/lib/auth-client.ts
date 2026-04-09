"use client";

import { createAuthClient } from "better-auth/client";

const serverBaseURL = process.env.BETTER_AUTH_URL
  ? `${process.env.BETTER_AUTH_URL}/api/auth`
  : "http://localhost:3000/api/auth";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined"
    ? `${window.location.origin}/api/auth`
    : serverBaseURL,
});
