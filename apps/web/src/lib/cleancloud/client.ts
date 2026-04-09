/**
 * Direct CleanCloud API client.
 *
 * Calls https://cleancloudapp.com/api directly using the CLEANCLOUD_API_TOKEN.
 * All CleanCloud API calls are rate-limited to stay under 3 req/sec.
 *
 * Rate limited to max 3 requests/second (400ms between requests).
 */

const API_BASE = "https://cleancloudapp.com/api";
const API_TOKEN = process.env.CLEANCLOUD_API_TOKEN ?? "";

// Rate limit: CleanCloud allows max 3 requests/second
let lastRequestTime = 0;

/**
 * Map of proxy paths (used by route handlers) to CleanCloud API endpoints.
 */
const ENDPOINT_MAP: Record<string, string> = {
  "/customers": "/addCustomer",
  "/customers/login": "/customerLogin",
  "/customers/password": "/customerResetPassword",
  "/orders": "/addOrder",
  "/products": "/getProducts",
  "/route": "/getRoute",
  "/scheduling/dates": "/getDates",
  "/scheduling/slots": "/getSlots",
};

/**
 * Map of proxy param names to CleanCloud param names.
 * The proxy used camelCase; CleanCloud uses its own naming.
 */
const PARAM_MAP: Record<string, Record<string, string>> = {
  "/customers": {
    name: "customerName",
    email: "customerEmail",
    phone: "customerTel",
    address: "customerAddress",
    password: "customerPassword",
    promoCode: "promoCode",
  },
  "/customers/login": {
    email: "customerEmail",
    password: "customerPassword",
  },
  "/customers/password": {
    email: "customerEmail",
  },
  "/route": {
    zip: "customerAddress",
    address: "customerAddress",
    lat: "lat",
    lng: "lng",
  },
  "/scheduling/dates": {
    routeID: "routeID",
  },
  "/scheduling/slots": {
    routeID: "routeID",
    day: "day",
  },
};

/**
 * Response envelope — matches the previous proxy format so route handlers
 * continue to work without changes.
 */
type CleanCloudResponse<T = Record<string, unknown>> = {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
};

async function rateLimitedFetch(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  if (!API_TOKEN) throw new Error("CLEANCLOUD_API_TOKEN not configured");

  // Ensure at least 400ms between requests
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 400) {
    await new Promise((resolve) => setTimeout(resolve, 400 - elapsed));
  }
  lastRequestTime = Date.now();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_token: API_TOKEN, ...body }),
  });

  if (!response.ok) {
    throw new Error(`CleanCloud API error: HTTP ${response.status}`);
  }

  return response.json() as Promise<Record<string, unknown>>;
}

function mapParams(
  path: string,
  params: Record<string, unknown>,
): Record<string, unknown> {
  const mapping = PARAM_MAP[path];
  if (!mapping) return params;

  const mapped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    const ccKey = mapping[key] ?? key;
    mapped[ccKey] = value;
  }
  return mapped;
}

/**
 * Transform CleanCloud's raw response into our standard envelope.
 * CleanCloud returns data directly with an Error field on failure.
 */
function transformResponse<T>(
  path: string,
  raw: Record<string, unknown>,
): CleanCloudResponse<T> {
  // Check for errors
  const error = raw.Error ?? raw.error;
  if (error && typeof error === "string") {
    return { success: false, error };
  }

  // Transform based on endpoint
  switch (path) {
    case "/customers": {
      const customerID =
        (raw.CustomerID as number) ?? (raw.customerID as number);
      if (!customerID) {
        return { success: false, error: "No customer ID returned" };
      }
      return { success: true, data: { customerID } as T };
    }

    case "/customers/login": {
      const cid =
        (raw.CustomerID as number) ?? (raw.customerID as number) ?? (raw.cid as number);
      if (!cid) {
        return { success: false, error: "Invalid email or password" };
      }
      return { success: true, data: { cid } as T };
    }

    case "/customers/password": {
      return { success: true, data: raw as T };
    }

    case "/orders": {
      const orderID = (raw.orderID as number) ?? (raw.OrderID as number);
      if (!orderID) {
        return { success: false, error: "No order ID returned" };
      }
      return { success: true, data: { orderID, ...raw } as T };
    }

    case "/products": {
      const products = (raw.products as unknown[]) ?? (raw.Products as unknown[]) ?? [];
      return { success: true, data: { products } as T };
    }

    case "/route": {
      const routeID = (raw.Route as number) ?? (raw.routeID as number);
      if (!routeID) {
        return { success: false, error: "No route found" };
      }
      const routeName = (raw.RouteName as string) ?? undefined;
      return { success: true, data: { routeID, routeName } as T };
    }

    case "/scheduling/dates": {
      const dates = (raw.Dates as unknown[]) ?? (raw.dates as unknown[]) ?? [];
      return { success: true, data: { Dates: dates } as T };
    }

    case "/scheduling/slots": {
      const slots = (raw.Slots as string) ?? (raw.slots as string) ?? "";
      return { success: true, data: { Slots: slots } as T };
    }

    default:
      return { success: true, data: raw as T };
  }
}

/**
 * Call CleanCloud API directly.
 *
 * @param path - The proxy-style path (e.g. "/customers", "/orders")
 * @param params - Parameters in proxy format (automatically mapped to CC format)
 */
export async function cleancloudProxy<T = Record<string, unknown>>(
  path: string,
  params: Record<string, unknown> = {},
): Promise<CleanCloudResponse<T>> {
  const endpoint = ENDPOINT_MAP[path];
  if (!endpoint) throw new Error(`Unknown CleanCloud path: ${path}`);

  const mappedParams = mapParams(path, params);
  const raw = await rateLimitedFetch(endpoint, mappedParams);
  return transformResponse<T>(path, raw);
}
