import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";
import type { RouteResult, DateEntry, Product, OrderResult, Order } from "@wdl/api";

export type { RouteResult, DateEntry, Product, OrderResult, Order };

async function fetchApi<T>(
  path: string,
  method: "GET" | "POST" = "POST",
  body?: Record<string, unknown>
): Promise<T> {
  const result = await apiRequest<T>(path, { method, body });
  if (!result.success) {
    throw new Error(result.error ?? "Request failed");
  }
  return result.data as T;
}

// --- Scheduling ---

export function useRouteLookup() {
  return useMutation({
    mutationFn: (params: {
      readonly zip?: string;
      readonly address?: string;
      readonly lat?: number;
      readonly lng?: number;
    }) =>
      fetchApi<RouteResult>(
        "/api/cleancloud/route",
        "POST",
        params as Record<string, unknown>
      ),
  });
}

export function useDates(routeID: number | null) {
  return useQuery({
    queryKey: ["dates", routeID],
    queryFn: () =>
      fetchApi<{ readonly dates: readonly DateEntry[] }>(
        "/api/cleancloud/scheduling/dates",
        "POST",
        { routeID: routeID! }
      ),
    enabled: routeID !== null,
    select: (d) => d.dates,
  });
}

export function useSlots(routeID: number | null, day: number | null) {
  return useQuery({
    queryKey: ["slots", routeID, day],
    queryFn: () =>
      fetchApi<{ readonly slots: readonly string[] }>(
        "/api/cleancloud/scheduling/slots",
        "POST",
        { routeID: routeID!, day: day! }
      ),
    enabled: routeID !== null && day !== null,
    select: (d) => d.slots,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () =>
      fetchApi<{ readonly products: readonly Product[] }>(
        "/api/cleancloud/products",
        "POST"
      ),
    select: (d) => d.products,
  });
}

// --- Orders ---

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      readonly pickupDate?: number;
      readonly pickupStart?: string;
      readonly products?: readonly {
        readonly productID: number;
        readonly quantity: number;
      }[];
      readonly orderNotes?: string;
      readonly finalTotal?: number;
    }) =>
      fetchApi<OrderResult>(
        "/api/mobile/orders",
        "POST",
        params as Record<string, unknown>
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetchApi<{ readonly orders: readonly Order[] }>(
        "/api/mobile/orders/list",
        "POST"
      ),
    select: (d) => d.orders,
  });
}

// --- Preferences ---

export function usePreferences() {
  return useQuery({
    queryKey: ["preferences"],
    queryFn: () =>
      fetchApi<{ readonly preferences: Record<string, unknown> }>(
        "/api/mobile/preferences",
        "GET"
      ),
    select: (d) => d.preferences,
  });
}

export function useSavePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prefs: Record<string, unknown>) =>
      fetchApi("/api/mobile/preferences", "POST", prefs),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preferences"] }),
  });
}
