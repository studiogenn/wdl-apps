"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, ButtonLink } from "@/components/shared";
import { BillingSection } from "./billing-section";
import { OrderPaymentModal } from "./order-payment-modal";

type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
};

type Order = {
  readonly orderID?: number;
  readonly status?: string;
  readonly statusCategory?: string;
  readonly isTerminal?: boolean;
  readonly service?: string;
  readonly total?: number;
  readonly paid?: boolean;
  readonly pickupDate?: string;
  readonly pickupStart?: string;
  readonly pickupEnd?: string;
  readonly deliveryDate?: string;
  readonly deliveryStart?: string;
  readonly deliveryEnd?: string;
  readonly weight?: number;
  readonly pieces?: number;
  readonly receiptLink?: string;
  readonly createdDate?: string;
};

type DashboardProps = {
  readonly user: User;
};

export function Dashboard({ user }: DashboardProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<readonly Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/mobile/orders/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data?.orders ?? []);
        }
      } catch {
        // Orders may not be available if no CleanCloud account linked
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    await authClient.signOut();
    router.refresh();
  }, [router]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* User Card */}
      <div className="rounded-xl border border-navy/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading-medium text-navy">{user.name}</h1>
            <p className="mt-1 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
              {user.email}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <ButtonLink href="/account/schedule" className="text-center">
          Schedule Pickup
        </ButtonLink>
        <ButtonLink href="/account/manage" variant="outline" className="text-center">
          Manage Account
        </ButtonLink>
      </div>

      {/* Billing */}
      <BillingSection />

      {/* Orders */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-heading-medium text-navy">Recent Orders</h2>

        {ordersLoading && (
          <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">
            Loading orders...
          </p>
        )}

        {!ordersLoading && orders.length === 0 && (
          <div className="rounded-xl border border-navy/10 bg-white p-8 text-center">
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
              No orders yet. Schedule your first pickup to get started.
            </p>
          </div>
        )}

        {!ordersLoading && orders.length > 0 && (() => {
          // Compute "April #1" style labels: group by month, number chronologically within each
          const sorted = [...orders].sort((a, b) =>
            new Date(a.createdDate ?? 0).getTime() - new Date(b.createdDate ?? 0).getTime()
          );
          const monthCounts = new Map<string, number>();
          const labelMap = new Map<number | undefined, string>();
          for (const o of sorted) {
            const d = o.createdDate ? new Date(o.createdDate) : null;
            if (!d) continue;
            const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
            const monthName = d.toLocaleDateString("en-US", { month: "long" });
            const count = (monthCounts.get(monthKey) ?? 0) + 1;
            monthCounts.set(monthKey, count);
            labelMap.set(o.orderID, `${monthName} #${count}`);
          }
          return (
          <div className="space-y-3">
            {orders.slice(0, 10).map((order, i) => (
              <div
                key={order.orderID ?? i}
                className="rounded-xl border border-navy/10 bg-white px-6 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                      {labelMap.get(order.orderID) ?? `#${order.orderID}`}
                    </p>
                    {order.status && (
                      <span className={`rounded-full px-2.5 py-0.5 font-[family-name:var(--font-poppins)] text-xs font-body-medium ${
                        order.statusCategory === "complete" ? "bg-green-100 text-green-700" :
                        order.statusCategory === "in_progress" ? "bg-blue-100 text-blue-700" :
                        order.statusCategory === "canceled" ? "bg-navy/10 text-navy/50" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {order.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {typeof order.total === "number" && order.total > 0 && (
                      <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                        ${order.total.toFixed(2)}
                      </p>
                    )}
                    {order.receiptLink && (
                      <a
                        href={order.receiptLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-[family-name:var(--font-poppins)] text-xs text-primary underline underline-offset-2 hover:text-primary-hover"
                      >
                        Receipt
                      </a>
                    )}
                    {typeof order.total === "number" && order.total > 0 && !order.paid && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPayingOrder(order)}
                      >
                        Pay
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-[family-name:var(--font-poppins)] text-xs text-navy/50">
                  {order.service && <span>{order.service}</span>}
                  {order.pickupDate && (
                    <span>Pickup: {new Date(order.pickupDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  )}
                  {order.deliveryDate && (
                    <span>Delivery: {new Date(order.deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  )}
                  {order.weight != null && order.weight > 0 && <span>{order.weight} lbs</span>}
                  {order.pieces != null && order.pieces > 0 && <span>{order.pieces} pcs</span>}
                </div>
              </div>
            ))}
          </div>
          );
        })()}
      </div>

      {payingOrder && typeof payingOrder.orderID === "number" && typeof payingOrder.total === "number" && (
        <OrderPaymentModal
          amountCents={Math.round(payingOrder.total * 100)}
          orderID={payingOrder.orderID}
          onClose={() => setPayingOrder(null)}
          onSuccess={() => {
            setPayingOrder(null);
            // Remove paid order from list
            setOrders((prev) => prev.filter((o) => o.orderID !== payingOrder.orderID));
          }}
        />
      )}
    </div>
  );
}
