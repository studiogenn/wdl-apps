import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  CLEANCLOUD_API_TOKEN: string;
  CLEANCLOUD_API_BASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
