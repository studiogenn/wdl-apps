import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "./db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _auth: any = null;

function createAuth() {
  return betterAuth({
    basePath: "/api/auth",
    trustedOrigins: [
      (process.env.BETTER_AUTH_URL ?? "").trim(),
      "wedeliverlaundry://",
      "exp://",
    ].filter(Boolean),
    database: drizzleAdapter(getDb(), {
      provider: "pg",
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    user: {
      additionalFields: {
        phone: {
          type: "string",
          required: false,
          input: true,
        },
        cleancloudCustomerId: {
          type: "number",
          required: false,
          input: false,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    plugins: [nextCookies()],
  });
}

type Auth = ReturnType<typeof createAuth>;

function getAuth(): Auth {
  if (!_auth) _auth = createAuth();
  return _auth as Auth;
}

// Lazy proxy: defers initialization until first property access at runtime,
// so the module can be imported at build time without DATABASE_URL.
export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop, receiver) {
    const instance = getAuth();
    const value = Reflect.get(instance as object, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
  has(_target, prop) {
    const instance = getAuth();
    return prop in (instance as object);
  },
});

export type Session = typeof auth.$Infer.Session;
