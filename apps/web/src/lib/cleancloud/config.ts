export const CLEANCLOUD_CONFIG = {
  baseUrl: "https://cleancloudapp.com/api",
  apiToken: process.env.CLEANCLOUD_API_KEY ?? "",
} as const;
