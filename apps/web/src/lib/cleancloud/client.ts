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

// ─── Direct API helpers (used by server-side pipelines) ──────────────

/**
 * Low-level POST to CleanCloud. Use for operations that don't fit the
 * proxy path mapping (e.g. searching customers by date range).
 */
export async function cleancloudPost(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  return rateLimitedFetch(endpoint, body);
}

/** Find a CleanCloud customer by email (searches last 31 days). */
export async function findCustomerByEmail(
  email: string,
): Promise<{ customerID: string; name: string; email: string } | null> {
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const dateTo = now.toISOString().split("T")[0];
  const dateFrom = monthAgo.toISOString().split("T")[0];

  const data = await rateLimitedFetch("/getCustomer", { dateFrom, dateTo });
  const customers =
    (data.Customers as Array<Record<string, unknown>>) ??
    (data.customers as Array<Record<string, unknown>>) ??
    [];

  const match = customers.find(
    (c) =>
      ((c.Email as string) ?? (c.email as string) ?? "").toLowerCase() ===
      email.toLowerCase(),
  );

  if (!match) return null;

  return {
    customerID: String(match.ID ?? match.id),
    name: String(match.Name ?? match.name ?? ""),
    email: String(match.Email ?? match.email ?? ""),
  };
}

/** Find existing customer or create a new one. Returns customerID. */
export async function findOrCreateCustomer(params: {
  name: string;
  email: string;
  phone: string;
  address?: string;
}): Promise<string> {
  const existing = await findCustomerByEmail(params.email);
  if (existing) return existing.customerID;

  const phone =
    params.phone && params.phone.length >= 7 ? params.phone : "0000000000";
  const data = await rateLimitedFetch("/addCustomer", {
    customerName: params.name,
    customerEmail: params.email,
    customerTel: phone,
    customerAddress: params.address ?? "",
  });

  if (data.CustomerID) return String(data.CustomerID);

  // Customer may already exist
  if (
    data.Error &&
    typeof data.Error === "string" &&
    data.Error.includes("already exists")
  ) {
    const found = await findCustomerByEmail(params.email);
    if (found) return found.customerID;
  }

  if (data.Error) throw new Error(`CleanCloud addCustomer: ${data.Error}`);
  return String(data.customerID ?? data.CustomerID);
}

/** Create an order in CleanCloud. Returns orderID. */
export async function addOrder(params: {
  customerID: string;
  products: Array<{
    id: string;
    price: string;
    pieces: string;
    quantity: string;
    name: string;
  }>;
  finalTotal: string;
  delivery?: number;
  paid?: number;
  paymentType?: number;
  notifyMethod?: number;
  orderNotes?: string;
  pickupDate?: string;
  pickupStart?: string;
  pickupEnd?: string;
  deliveryDate?: string;
  deliveryStart?: string;
  deliveryEnd?: string;
}): Promise<string> {
  const data = await rateLimitedFetch("/addOrder", {
    customerID: params.customerID,
    products: params.products,
    finalTotal: params.finalTotal,
    delivery: params.delivery ?? 1,
    paid: params.paid ?? 1,
    paymentType: params.paymentType ?? 2,
    notifyMethod: params.notifyMethod ?? 4,
    orderNotes: params.orderNotes ?? "",
    ...(params.pickupDate && { pickupDate: params.pickupDate }),
    ...(params.pickupStart && { pickupStart: params.pickupStart }),
    ...(params.pickupEnd && { pickupEnd: params.pickupEnd }),
    ...(params.deliveryDate && { deliveryDate: params.deliveryDate }),
    ...(params.deliveryStart && { deliveryStart: params.deliveryStart }),
    ...(params.deliveryEnd && { deliveryEnd: params.deliveryEnd }),
  });

  if (data.Error) throw new Error(`CleanCloud addOrder: ${data.Error}`);
  return String(data.orderID ?? data.OrderID);
}

/** Get the next available pickup/delivery schedule for an address. */
export async function getNextPickupDelivery(address: string): Promise<{
  routeID: string;
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
} | null> {
  if (!address) return null;

  try {
    const route = await rateLimitedFetch("/getRoute", {
      customerAddress: address,
    });
    if (!route.Route) return null;
    const routeID = String(route.Route);

    const datesData = await rateLimitedFetch("/getDates", { routeID });
    const dates =
      (datesData.Dates as Array<Record<string, unknown>>) ?? [];
    if (dates.length === 0) return null;

    const pickup = dates[0];
    const pickupTime = String(pickup.times ?? "").split(",")[0];

    const minDeliveryStamp = (datesData.MinDeliveryDateStamp as number) ?? 0;
    const delivery =
      dates.find(
        (d) => (d.dateStamp as number) >= minDeliveryStamp,
      ) ??
      dates[1] ??
      dates[0];
    const deliveryTime = String(delivery.times ?? "").split(",")[0];

    return {
      routeID,
      pickupDate: String(pickup.dateStamp),
      pickupTime,
      deliveryDate: String(delivery.dateStamp),
      deliveryTime,
    };
  } catch {
    return null;
  }
}
