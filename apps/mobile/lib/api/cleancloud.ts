const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "https://wedeliverlaundry.com";

type ApiResponse<T> = {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
};

async function post<T>(path: string, body: Record<string, unknown> = {}): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    return { success: false, error: data.error ?? "Request failed" };
  }

  return data as ApiResponse<T>;
}

// Route lookup by address/zip
export type RouteResult = { readonly routeID: number; readonly routeName?: string };

export async function getRoute(params: {
  readonly zip?: string;
  readonly address?: string;
  readonly lat?: number;
  readonly lng?: number;
}): Promise<ApiResponse<RouteResult>> {
  return post<RouteResult>("/api/cleancloud/route", params);
}

// Available dates for a route
export type DateEntry = {
  readonly date: number;
  readonly slots?: string;
  readonly remaining?: number;
};

export async function getDates(routeID: number): Promise<ApiResponse<{ readonly dates: readonly DateEntry[] }>> {
  return post<{ readonly dates: readonly DateEntry[] }>("/api/cleancloud/scheduling/dates", { routeID });
}

// Time slots for a specific date
export async function getSlots(routeID: number, day: number): Promise<ApiResponse<{ readonly slots: readonly string[] }>> {
  return post<{ readonly slots: readonly string[] }>("/api/cleancloud/scheduling/slots", { routeID, day });
}

// Product catalog
export type Product = {
  readonly productID: number;
  readonly name: string;
  readonly price: number;
};

export async function getProducts(): Promise<ApiResponse<{ readonly products: readonly Product[] }>> {
  return post<{ readonly products: readonly Product[] }>("/api/cleancloud/products");
}

// Create order
export type OrderResult = { readonly orderID: number };

export async function createOrder(params: {
  readonly customerID: number;
  readonly pickupDate?: number;
  readonly pickupStart?: string;
  readonly pickupEnd?: string;
  readonly deliveryDate?: number;
  readonly deliveryStart?: string;
  readonly deliveryEnd?: string;
  readonly products?: readonly { readonly productID: number; readonly quantity: number }[];
  readonly orderNotes?: string;
  readonly finalTotal?: number;
}): Promise<ApiResponse<OrderResult>> {
  return post<OrderResult>("/api/cleancloud/orders", params);
}
