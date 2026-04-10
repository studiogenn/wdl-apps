"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, ButtonLink } from "@/components/shared";
import { BillingSection } from "./billing-section";
import { OrderPaymentModal } from "./order-payment-modal";
import { CardUpdateModal } from "./card-update-modal";

// ── Types ──

type User = { readonly id: string; readonly name: string; readonly email: string };

type Profile = {
  email: string; name: string; phone: string;
  address: string; apt: string; city: string; state: string; zip: string;
};

type Preferences = {
  detergent: string; bleach: string; fabricSoftener: string;
  dryerTemperature: string; dryerSheets: string;
};

type Delivery = { gateCode: string; instructions: string; bagLocation: string };

type Order = {
  readonly orderID?: number; readonly status?: string; readonly statusCategory?: string;
  readonly service?: string; readonly total?: number; readonly paid?: boolean;
  readonly pickupDate?: string; readonly pickupStart?: string; readonly pickupEnd?: string;
  readonly deliveryDate?: string; readonly deliveryStart?: string; readonly deliveryEnd?: string;
  readonly weight?: number; readonly pieces?: number; readonly receiptLink?: string;
  readonly createdDate?: string;
};

type DashboardData = {
  profile: Profile; preferences: Preferences; delivery: Delivery;
  orders: readonly Order[]; hasCleanCloud: boolean; hasSubscription: boolean;
};

type Modal = null | "preferences" | "delivery" | "profile" | "card";
type DashboardProps = { readonly user: User };

// ── Preference Options ──

const DETERGENT_OPTIONS = ["Tide Free & Gentle", "Tide Original", "All Free & Clear", "Gain Original", "Custom"];
const SOFTENER_OPTIONS = ["None", "Downy Free & Gentle", "Downy April Fresh", "Snuggle"];
const DRYER_TEMP_OPTIONS = ["Low", "Medium", "High"];
const DRYER_SHEET_OPTIONS = ["None", "Bounce Free & Gentle", "Bounce Outdoor Fresh"];

// ── Helpers ──

const inputClass = "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelClass = "mb-1 block font-[family-name:var(--font-poppins)] text-[11px] font-semibold uppercase tracking-[1.5px] text-navy/40";
const cardClass = "rounded-xl border border-navy/10 bg-white p-5";
const cardHeaderClass = "font-[family-name:var(--font-poppins)] text-[10px] font-semibold uppercase tracking-[2px] text-navy/40 mb-2";
const cardValueClass = "font-[family-name:var(--font-poppins)] text-sm text-navy";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatAddress(p: Profile): string {
  const parts = [p.address, p.apt, p.city, p.state, p.zip].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "";
}

// ── Component ──

export function Dashboard({ user }: DashboardProps) {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);

  // Draft state for modals
  const [prefDraft, setPrefDraft] = useState<Preferences>({ detergent: "", bleach: "", fabricSoftener: "", dryerTemperature: "", dryerSheets: "" });
  const [deliveryDraft, setDeliveryDraft] = useState<Delivery>({ gateCode: "", instructions: "", bagLocation: "" });
  const [profileDraft, setProfileDraft] = useState<Profile>({ email: "", name: "", phone: "", address: "", apt: "", city: "", state: "", zip: "" });

  // Fetch dashboard data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/account/dashboard");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {
        // Dashboard unavailable
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Save handler
  const handleSave = useCallback(async (section: "profile" | "preferences" | "delivery", fields: Record<string, string>) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/account/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, fields }),
      });
      const json = await res.json();
      if (json.success) {
        // Re-fetch to get updated data
        const refreshRes = await fetch("/api/account/dashboard");
        const refreshJson = await refreshRes.json();
        if (refreshJson.success) setData(refreshJson.data);
        setModal(null);
      } else {
        setError(json.error ?? "Unable to save.");
      }
    } catch {
      setError("Something went wrong.");
    }
    setSaving(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    await authClient.signOut();
    router.refresh();
  }, [router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40 text-center">Loading your dashboard...</p>
      </div>
    );
  }

  const profile = data?.profile ?? { email: user.email, name: user.name, phone: "", address: "", apt: "", city: "", state: "", zip: "" };
  const prefs = data?.preferences ?? { detergent: "", bleach: "", fabricSoftener: "", dryerTemperature: "", dryerSheets: "" };
  const delivery = data?.delivery ?? { gateCode: "", instructions: "", bagLocation: "" };
  const orders = data?.orders ?? [];
  const hasSubscription = data?.hasSubscription ?? false;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">

      {/* ── Quick Actions ── */}
      {hasSubscription ? (
        <div>
          <ButtonLink href="/account/schedule" className="justify-center py-6 text-center w-full">
            Schedule Pickup
          </ButtonLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ButtonLink href="/account/schedule" className="justify-center py-6 text-center">
            Schedule Pickup
          </ButtonLink>
          <ButtonLink href="/order" variant="outline" className="justify-center py-6 text-center">
            One-Time Order
          </ButtonLink>
          <ButtonLink href="/subscriptions" variant="outline" className="justify-center py-6 text-center bg-navy text-white border-navy hover:bg-navy/90">
            Join a Plan
          </ButtonLink>
        </div>
      )}

      {/* ── Orders ── */}
      <div className="mt-8">
        <h2 className="mb-3 text-lg font-heading-medium text-navy">Orders</h2>
        {orders.length === 0 ? (
          <div className={`${cardClass} text-center`}>
            <p className={cardHeaderClass}>ORDERS</p>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50">
              No orders yet. History appears here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 10).map((order, i) => (
              <div key={order.orderID ?? i} className={cardClass}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                      #{order.orderID}
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
                      <a href={order.receiptLink} target="_blank" rel="noopener noreferrer"
                        className="font-[family-name:var(--font-poppins)] text-xs text-primary underline underline-offset-2 hover:text-primary-hover">
                        Receipt
                      </a>
                    )}
                    {typeof order.total === "number" && order.total > 0 && !order.paid && (
                      <Button variant="outline" size="sm" onClick={() => setPayingOrder(order)}>Pay</Button>
                    )}
                  </div>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-[family-name:var(--font-poppins)] text-xs text-navy/50">
                  {order.service && <span>{order.service}</span>}
                  {order.pickupDate && <span>Pickup: {formatDate(order.pickupDate)}{order.pickupStart ? ` ${order.pickupStart}` : ""}</span>}
                  {order.deliveryDate && <span>Delivery: {formatDate(order.deliveryDate)}{order.deliveryStart ? ` ${order.deliveryStart}` : ""}</span>}
                  {order.weight != null && order.weight > 0 && <span>{order.weight} lbs</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Address + Delivery Row ── */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={cardClass}>
          <p className={cardHeaderClass}>ADDRESS</p>
          <p className={cardValueClass}>
            {formatAddress(profile) || "No address on file"}
          </p>
          <button
            onClick={() => { setProfileDraft({ ...profile }); setModal("profile"); setError(null); }}
            className="mt-2 font-[family-name:var(--font-poppins)] text-xs text-primary font-body-medium hover:underline"
          >
            Edit
          </button>
        </div>
        <div className={cardClass}>
          <p className={cardHeaderClass}>DELIVERY</p>
          <p className={cardValueClass}>
            {delivery.gateCode ? `Gate: ${delivery.gateCode}` : ""}
            {delivery.gateCode && delivery.instructions ? " · " : ""}
            {delivery.instructions || (!delivery.gateCode ? "No delivery instructions" : "")}
          </p>
          {delivery.bagLocation && (
            <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50 mt-0.5">
              Bag: {delivery.bagLocation}
            </p>
          )}
          <button
            onClick={() => { setDeliveryDraft({ ...delivery }); setModal("delivery"); setError(null); }}
            className="mt-2 font-[family-name:var(--font-poppins)] text-xs text-primary font-body-medium hover:underline"
          >
            {delivery.gateCode || delivery.instructions ? "Edit" : "Add"}
          </button>
        </div>
      </div>

      {/* ── Payment + Preferences Row ── */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={cardClass}>
          <p className={cardHeaderClass}>PAYMENT</p>
          <button
            onClick={() => { setModal("card"); setError(null); }}
            className="font-[family-name:var(--font-poppins)] text-sm text-primary font-body-medium hover:underline"
          >
            Update card
          </button>
        </div>
        <div className={cardClass}>
          <p className={cardHeaderClass}>PREFERENCES</p>
          <p className={cardValueClass}>
            {prefs.detergent || "Not set"}
          </p>
          <button
            onClick={() => { setPrefDraft({ ...prefs }); setModal("preferences"); setError(null); }}
            className="mt-2 font-[family-name:var(--font-poppins)] text-xs text-primary font-body-medium hover:underline"
          >
            {prefs.detergent ? "Edit" : "Set"}
          </button>
        </div>
      </div>

      {/* ── Billing ── */}
      <BillingSection />

      {/* ── Profile + Help Row ── */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10 font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
              {(profile.name || user.name || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                {profile.name || user.name}
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50">
                {profile.email} · {profile.phone || "No phone"}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setProfileDraft({ ...profile }); setModal("profile"); setError(null); }}
            className="font-[family-name:var(--font-poppins)] text-xs text-primary font-body-medium hover:underline"
          >
            Edit profile
          </button>
          <span className="mx-2 font-[family-name:var(--font-poppins)] text-xs text-navy/20">|</span>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="font-[family-name:var(--font-poppins)] text-xs text-navy/40 hover:text-red-500"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
        <div className="rounded-xl bg-navy/[0.04] p-5">
          <p className={cardHeaderClass}>HELP</p>
          <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
            Need help?
          </p>
          <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50 mt-1">
            <a href="tel:+18559685511" className="hover:text-primary">(855) 968-5511</a>
            <span className="mx-1.5">·</span>
            <a href="mailto:start@wedeliverlaundry.com" className="hover:text-primary">start@wedeliverlaundry.com</a>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MODALS
         ══════════════════════════════════════════════════════════ */}

      {/* ── Preferences Modal ── */}
      {modal === "preferences" && (
        <ModalShell title="Preferences" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <SelectField label="Detergent" value={prefDraft.detergent} options={DETERGENT_OPTIONS}
              onChange={(v) => setPrefDraft({ ...prefDraft, detergent: v })} />
            <SelectField label="Softener" value={prefDraft.fabricSoftener} options={SOFTENER_OPTIONS}
              onChange={(v) => setPrefDraft({ ...prefDraft, fabricSoftener: v })} />
            <SelectField label="Dryer Temp" value={prefDraft.dryerTemperature} options={DRYER_TEMP_OPTIONS}
              onChange={(v) => setPrefDraft({ ...prefDraft, dryerTemperature: v })} />
            <SelectField label="Dryer Sheets" value={prefDraft.dryerSheets} options={DRYER_SHEET_OPTIONS}
              onChange={(v) => setPrefDraft({ ...prefDraft, dryerSheets: v })} />
          </div>
          {error && <p className="mt-3 font-[family-name:var(--font-poppins)] text-xs text-red-600">{error}</p>}
          <Button className="mt-5 w-full" disabled={saving}
            onClick={() => handleSave("preferences", {
              detergent: prefDraft.detergent,
              fabricSoftener: prefDraft.fabricSoftener,
              dryerTemperature: prefDraft.dryerTemperature,
              dryerSheets: prefDraft.dryerSheets,
            })}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </ModalShell>
      )}

      {/* ── Delivery Modal ── */}
      {modal === "delivery" && (
        <ModalShell title="Delivery Instructions" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Gate Code</label>
              <input type="text" value={deliveryDraft.gateCode} onChange={(e) => setDeliveryDraft({ ...deliveryDraft, gateCode: e.target.value })} placeholder="#1234" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Instructions</label>
              <input type="text" value={deliveryDraft.instructions} onChange={(e) => setDeliveryDraft({ ...deliveryDraft, instructions: e.target.value })} placeholder="Leave with doorman" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bag Location</label>
              <input type="text" value={deliveryDraft.bagLocation} onChange={(e) => setDeliveryDraft({ ...deliveryDraft, bagLocation: e.target.value })} placeholder="Front door" className={inputClass} />
            </div>
          </div>
          {error && <p className="mt-3 font-[family-name:var(--font-poppins)] text-xs text-red-600">{error}</p>}
          <Button className="mt-5 w-full" disabled={saving}
            onClick={() => handleSave("delivery", deliveryDraft)}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </ModalShell>
      )}

      {/* ── Profile Modal ── */}
      {modal === "profile" && (
        <ModalShell title="Edit Profile" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email</label>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 px-1">{profileDraft.email}</p>
            </div>
            <div>
              <label className={labelClass}>Name</label>
              <input type="text" value={profileDraft.name} onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" value={profileDraft.phone} onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input type="text" value={profileDraft.address} onChange={(e) => setProfileDraft({ ...profileDraft, address: e.target.value })} placeholder="Street address" className={inputClass} />
            </div>
            <input type="text" value={profileDraft.apt} onChange={(e) => setProfileDraft({ ...profileDraft, apt: e.target.value })} placeholder="Apt (optional)" className={inputClass} />
            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={profileDraft.city} onChange={(e) => setProfileDraft({ ...profileDraft, city: e.target.value })} placeholder="City" className={inputClass} />
              <input type="text" value={profileDraft.state} onChange={(e) => setProfileDraft({ ...profileDraft, state: e.target.value })} placeholder="State" maxLength={2} className={inputClass} />
              <input type="text" value={profileDraft.zip} onChange={(e) => setProfileDraft({ ...profileDraft, zip: e.target.value })} placeholder="Zip" maxLength={10} className={inputClass} />
            </div>
          </div>
          {error && <p className="mt-3 font-[family-name:var(--font-poppins)] text-xs text-red-600">{error}</p>}
          <Button className="mt-5 w-full" disabled={saving}
            onClick={() => handleSave("profile", {
              name: profileDraft.name,
              phone: profileDraft.phone,
              address: profileDraft.address,
              apt: profileDraft.apt,
              city: profileDraft.city,
              state: profileDraft.state,
              zip: profileDraft.zip,
            })}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={async () => {
                try {
                  await fetch("/api/cleancloud/customers/password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: profileDraft.email }),
                  });
                  setError("Password reset link sent to your email.");
                } catch {
                  setError("Unable to send reset email.");
                }
              }}
              className="font-[family-name:var(--font-poppins)] text-xs text-navy/50 hover:text-primary"
            >
              Password
            </button>
          </div>
        </ModalShell>
      )}

      {/* ── Card Update Modal ── */}
      {modal === "card" && (
        <CardUpdateModal
          onClose={() => setModal(null)}
          onSuccess={() => setModal(null)}
        />
      )}

      {/* ── Order Payment Modal ── */}
      {payingOrder && typeof payingOrder.orderID === "number" && typeof payingOrder.total === "number" && (
        <OrderPaymentModal
          amountCents={Math.round(payingOrder.total * 100)}
          orderID={payingOrder.orderID}
          onClose={() => setPayingOrder(null)}
          onSuccess={() => {
            setPayingOrder(null);
            // Re-fetch to update order status
            fetch("/api/account/dashboard").then(r => r.json()).then(j => { if (j.success) setData(j.data); });
          }}
        />
      )}
    </div>
  );
}

// ── Shared Sub-components ──

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-navy/5 text-navy/40 hover:bg-navy/10 hover:text-navy">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <h3 className="font-heading-medium text-navy text-lg uppercase mb-5">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">{label}</p>
        <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50">{value || "Not set"}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-navy/15 bg-white px-3 py-1.5 font-[family-name:var(--font-poppins)] text-xs text-navy focus:border-primary focus:outline-none"
      >
        <option value="">Select</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
