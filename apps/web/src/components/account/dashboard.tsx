"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, ButtonLink } from "@/components/shared";

type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
};

type Order = {
  readonly orderID?: number;
  readonly status?: string;
  readonly [key: string]: unknown;
};

type DashboardProps = {
  readonly user: User;
};

export function Dashboard({ user }: DashboardProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<readonly Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);

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

  const handleManageBilling = useCallback(async () => {
    setBillingLoading(true);
    setBillingError(null);

    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/account`,
        }),
      });

      const data = await res.json();

      if (!data.success || !data.data?.url) {
        setBillingError(data.error ?? "Unable to open billing portal.");
        setBillingLoading(false);
        return;
      }

      window.location.href = data.data.url;
    } catch {
      setBillingError("Something went wrong. Please try again.");
      setBillingLoading(false);
    }
  }, []);

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
        <ButtonLink href="/account/guided" className="text-center">
          Schedule Pickup
        </ButtonLink>
        <ButtonLink href="/account/manage" variant="outline" className="text-center">
          Manage Account
        </ButtonLink>
      </div>

      {/* Billing */}
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-heading-medium text-navy">Billing</h2>
        <div className="rounded-xl border border-navy/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
              Manage your subscription, payment method, and invoices.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageBilling}
              disabled={billingLoading}
            >
              {billingLoading ? "Opening..." : "Manage Billing"}
            </Button>
          </div>
          {billingError ? (
            <p className="mt-3 font-[family-name:var(--font-poppins)] text-sm text-red-600">
              {billingError}
            </p>
          ) : null}
        </div>
      </div>

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

        {!ordersLoading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.slice(0, 10).map((order, i) => (
              <div
                key={order.orderID ?? i}
                className="flex items-center justify-between rounded-xl border border-navy/10 bg-white px-6 py-4"
              >
                <div>
                  <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                    Order #{order.orderID}
                  </p>
                  {order.status && (
                    <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50">
                      {String(order.status)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
