"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";
import { type MembershipTier } from "@/lib/stripe-config";
import { Button } from "@/components/shared";
import { AddressInput } from "@/components/account/address-input";
import { type CustomerProfile } from "./JoinFunnel";

const TIER_LABELS: Record<MembershipTier, { name: string; price: number; pickups: number; lbs: number }> = {
  weekly: { name: "Weekly", price: 139, pickups: 4, lbs: 80 },
  family: { name: "Family", price: 189, pickups: 4, lbs: 120 },
};

type DateWithSlots = {
  readonly date: string;
  readonly slots: readonly string[];
};

export type ScheduleData = {
  readonly pickupDate: string;      // ISO date e.g. "2026-04-09"
  readonly pickupSlot: string;      // e.g. "8am-12pm"
  readonly address: string;
  readonly routeID: number;
};

interface ScheduleStepProps {
  readonly tier: MembershipTier;
  readonly profile: CustomerProfile | null;
  readonly onComplete: (schedule: ScheduleData) => void;
  readonly onBack: () => void;
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function ScheduleStep({ tier, profile, onComplete, onBack }: ScheduleStepProps) {
  const isReturning = profile?.isReturning ?? false;
  const profileRouteId = profile?.routeId ?? null;

  const [address, setAddress] = useState(profile?.address ?? "");
  const [routeID, setRouteID] = useState<number | null>(profileRouteId);
  const [schedule, setSchedule] = useState<readonly DateWithSlots[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!profileRouteId);

  const tierInfo = TIER_LABELS[tier];

  const selectedDateSlots = schedule.find((d) => d.date === selectedDate)?.slots ?? [];

  // Single query — dates + slots in one response
  useEffect(() => {
    if (!routeID) return;

    setLoading(true);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSchedule([]);

    (async () => {
      try {
        const res = await fetch("/api/scheduling/windows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ routeId: routeID }),
        });
        const data = await res.json();
        if (data.success) {
          setSchedule(data.data.dates);
        }
      } catch {
        // Windows unavailable
      } finally {
        setLoading(false);
      }
    })();
  }, [routeID]);

  const handleAddressValidated = useCallback((id: number) => {
    setRouteID(id);
  }, []);

  const handleAddressInvalid = useCallback(() => {
    setRouteID(null);
    setSchedule([]);
    setSelectedDate(null);
    setSelectedSlot(null);
  }, []);

  const hasSchedule = routeID && selectedDate && selectedSlot;

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      {/* Welcome back banner */}
      {isReturning && (profile?.orderCount ?? 0) > 0 && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 text-center">
          <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
            Welcome back{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}
          </p>
          <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50 mt-0.5">
            {profile!.orderCount} order{profile!.orderCount !== 1 ? "s" : ""} with us so far
          </p>
        </div>
      )}

      <h2 className="font-heading-medium text-navy text-2xl uppercase text-center mb-2">
        Schedule your first pickup
      </h2>
      <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 text-center mb-8">
        Pick a day and time. We&apos;ll handle the rest.
      </p>

      {/* Plan summary */}
      <div className="mb-6 rounded-xl border border-navy/10 bg-white px-5 py-4 flex items-center justify-between">
        <div>
          <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
            {tierInfo.name} Plan
          </p>
          <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/50">
            {tierInfo.pickups} pickups/mo · Up to {tierInfo.lbs} lbs
          </p>
        </div>
        <p className="font-body-bold text-navy text-xl">${tierInfo.price}<span className="text-sm font-normal text-navy/50">/mo</span></p>
      </div>

      {/* Preferences (returning customers) */}
      {isReturning && profile?.preferences && (
        <div className="mb-6 rounded-xl border border-navy/10 bg-white px-5 py-4">
          <p className="font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/40 uppercase tracking-widest mb-3">
            Your preferences
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Detergent", value: profile.preferences.detergent },
              { label: "Softener", value: profile.preferences.fabricSoftener },
              { label: "Dryer", value: profile.preferences.dryerTemperature },
              { label: "Dryer sheets", value: profile.preferences.dryerSheets },
            ]
              .filter((p) => p.value && p.value !== "None Selected")
              .map((p) => (
                <div key={p.label} className="font-[family-name:var(--font-poppins)] text-xs">
                  <span className="text-navy/40">{p.label}: </span>
                  <span className="text-navy">{p.value}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Address — skip if profile has routeId */}
      {!profileRouteId && (
        <div className="mb-6">
          <AddressInput
            value={address}
            onChange={(addr) => {
              setAddress(addr);
              setRouteID(null);
              setSchedule([]);
              setSelectedDate(null);
              setSelectedSlot(null);
            }}
            onValidated={handleAddressValidated}
            onInvalid={handleAddressInvalid}
          />
        </div>
      )}

      {/* Dates */}
      {routeID && (
        <div className="mb-6">
          <label className="mb-2 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70">
            Pickup date
          </label>
          {loading ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-navy/5" />
              ))}
            </div>
          ) : schedule.length === 0 ? (
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">No dates available right now.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {schedule.slice(0, 6).map((d) => (
                <button
                  key={d.date}
                  onClick={() => { setSelectedDate(d.date); setSelectedSlot(null); }}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-center font-[family-name:var(--font-poppins)] text-sm transition-all",
                    selectedDate === d.date
                      ? "border-primary bg-primary text-white"
                      : "border-navy/10 bg-white text-navy hover:border-primary/40",
                  )}
                >
                  {formatDateLabel(d.date)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Time slots — instant from the same response */}
      {selectedDate && selectedDateSlots.length > 0 && (
        <div className="mb-6">
          <label className="mb-2 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70">
            Pickup window
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedDateSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "rounded-full border px-4 py-2.5 font-[family-name:var(--font-poppins)] text-sm transition-all",
                  selectedSlot === slot
                    ? "border-primary bg-primary text-white"
                    : "border-navy/10 bg-white text-navy hover:border-primary/40",
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button className="w-full" onClick={() => {
        if (selectedDate && selectedSlot && routeID) {
          onComplete({
            pickupDate: selectedDate,
            pickupSlot: selectedSlot,
            address,
            routeID,
          });
        } else {
          // Allow skipping — they can schedule from dashboard later
          onComplete({
            pickupDate: "",
            pickupSlot: "",
            address,
            routeID: routeID ?? 0,
          });
        }
      }}>
        Continue to Payment
      </Button>

      {hasSchedule ? (
        <p className="mt-3 text-center font-[family-name:var(--font-poppins)] text-[11px] text-navy/30">
          First pickup {formatDateLabel(selectedDate!)} {selectedSlot}
        </p>
      ) : (
        <p className="mt-3 text-center font-[family-name:var(--font-poppins)] text-[11px] text-navy/30">
          You can also schedule your first pickup from your dashboard after joining.
        </p>
      )}

      <button
        type="button"
        onClick={onBack}
        className="mt-4 w-full py-2 text-center font-[family-name:var(--font-poppins)] text-[13px] text-navy/40 hover:text-primary"
      >
        ← Back
      </button>
    </div>
  );
}
