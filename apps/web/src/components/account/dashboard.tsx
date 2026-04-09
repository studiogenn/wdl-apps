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
  const [managingAccount, setManagingAccount] = useState(false);
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [addressData, setAddressData] = useState({ street: "", apt: "", city: "", state: "", zip: "" });
  const [addressLoading, setAddressLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressDraft, setAddressDraft] = useState({ street: "", apt: "", city: "", state: "", zip: "" });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAddress() {
      try {
        const res = await fetch("/api/account/address");
        const data = await res.json();
        if (data.success && data.data) {
          setAddressData({
            street: data.data.street ?? "",
            apt: data.data.apt ?? "",
            city: data.data.city ?? "",
            state: data.data.state ?? "",
            zip: data.data.zip ?? "",
          });
        }
      } catch {
        // Address unavailable
      } finally {
        setAddressLoading(false);
      }
    }
    fetchAddress();
  }, []);

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

  const handleSaveAddress = useCallback(async () => {
    if (!addressDraft.street.trim() || !addressDraft.city.trim() || !addressDraft.state.trim() || !addressDraft.zip.trim()) {
      setAddressError("Please fill in street, city, state, and zip.");
      return;
    }
    setAddressSaving(true);
    setAddressError(null);
    try {
      const res = await fetch("/api/account/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressDraft),
      });
      const data = await res.json();
      if (data.success) {
        setAddressData({ ...addressDraft });
        setEditingAddress(false);
      } else {
        setAddressError(data.error ?? "Unable to update address.");
      }
    } catch {
      setAddressError("Something went wrong.");
    }
    setAddressSaving(false);
  }, [addressDraft]);

  const handleManageAccount = useCallback(async () => {
    setManagingAccount(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });
      const data = await res.json();
      if (data.success && data.data.url) {
        window.location.href = data.data.url;
        return;
      }
    } catch {
      // Fall through
    }
    setManagingAccount(false);
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

      {/* Pickup Address */}
      <div className="mt-4 rounded-xl border border-navy/10 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/40 uppercase tracking-wider mb-1">
              Pickup Address
            </p>
            {editingAddress ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={addressDraft.street}
                  onChange={(e) => setAddressDraft({ ...addressDraft, street: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Street address"
                />
                <input
                  type="text"
                  value={addressDraft.apt}
                  onChange={(e) => setAddressDraft({ ...addressDraft, apt: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Apt, suite, unit (optional)"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={addressDraft.city}
                    onChange={(e) => setAddressDraft({ ...addressDraft, city: e.target.value })}
                    className="w-full rounded-lg border border-navy/15 px-3 py-2 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={addressDraft.state}
                    onChange={(e) => setAddressDraft({ ...addressDraft, state: e.target.value })}
                    className="w-full rounded-lg border border-navy/15 px-3 py-2 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="State"
                    maxLength={2}
                  />
                  <input
                    type="text"
                    value={addressDraft.zip}
                    onChange={(e) => setAddressDraft({ ...addressDraft, zip: e.target.value })}
                    className="w-full rounded-lg border border-navy/15 px-3 py-2 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Zip"
                    maxLength={10}
                  />
                </div>
                {addressError && (
                  <p className="font-[family-name:var(--font-poppins)] text-xs text-red-600">{addressError}</p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveAddress} disabled={addressSaving}>
                    {addressSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setEditingAddress(false); setAddressError(null); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70">
                {addressLoading
                  ? "Loading..."
                  : addressData.street
                    ? [addressData.street, addressData.apt, addressData.city, addressData.state, addressData.zip].filter(Boolean).join(", ")
                    : "No address on file"}
              </p>
            )}
          </div>
          {!editingAddress && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setEditingAddress(true); setAddressDraft({ ...addressData }); }}
            >
              {addressData.street ? "Edit" : "Add"}
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <ButtonLink href="/account/schedule" className="text-center">
          Schedule Pickup
        </ButtonLink>
        <Button
          variant="outline"
          className="text-center"
          onClick={handleManageAccount}
          disabled={managingAccount}
        >
          {managingAccount ? "Opening..." : "Manage Account"}
        </Button>
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
