"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";
import { type MembershipTier } from "@/lib/stripe-config";
import { Button } from "@/components/shared";
import { AddressInput } from "@/components/account/address-input";

const TIER_LABELS: Record<MembershipTier, { name: string; price: number; pickups: number; lbs: number }> = {
  weekly: { name: "Weekly", price: 139, pickups: 4, lbs: 80 },
  family: { name: "Family", price: 189, pickups: 4, lbs: 120 },
};

type DateOption = {
  readonly date: number;
  readonly remaining?: number;
};

interface ScheduleStepProps {
  readonly tier: MembershipTier;
  readonly onComplete: () => void;
  readonly onBack: () => void;
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatSlot(slot: string): string {
  return slot.trim();
}

export function ScheduleStep({ tier, onComplete, onBack }: ScheduleStepProps) {
  const [address, setAddress] = useState("");
  const [routeID, setRouteID] = useState<number | null>(null);
  const [dates, setDates] = useState<readonly DateOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [slots, setSlots] = useState<readonly string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const tierInfo = TIER_LABELS[tier];

  // Fetch dates when route is validated
  useEffect(() => {
    if (!routeID) return;

    async function fetchDates() {
      setLoadingDates(true);
      setSelectedDate(null);
      setSlots([]);
      setSelectedSlot(null);

      try {
        const res = await fetch("/api/cleancloud/scheduling/dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ routeID }),
        });
        const data = await res.json();
        if (data.success) {
          setDates(data.data.dates);
        }
      } catch {
        // Dates unavailable
      } finally {
        setLoadingDates(false);
      }
    }

    fetchDates();
  }, [routeID]);

  // Fetch slots when date is selected
  useEffect(() => {
    if (!routeID || !selectedDate) return;

    async function fetchSlots() {
      setLoadingSlots(true);
      setSelectedSlot(null);

      try {
        const res = await fetch("/api/cleancloud/scheduling/slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ routeID, day: selectedDate }),
        });
        const data = await res.json();
        if (data.success) {
          setSlots(data.data.slots);
        }
      } catch {
        // Slots unavailable
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [routeID, selectedDate]);

  const handleAddressValidated = useCallback((id: number) => {
    setRouteID(id);
  }, []);

  const handleAddressInvalid = useCallback(() => {
    setRouteID(null);
    setDates([]);
    setSelectedDate(null);
    setSlots([]);
    setSelectedSlot(null);
  }, []);

  const hasSchedule = routeID && selectedDate && selectedSlot;

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
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

      {/* Address */}
      <div className="mb-6">
        <AddressInput
          value={address}
          onChange={(addr) => {
            setAddress(addr);
            setRouteID(null);
            setDates([]);
            setSelectedDate(null);
            setSlots([]);
            setSelectedSlot(null);
          }}
          onValidated={handleAddressValidated}
          onInvalid={handleAddressInvalid}
        />
      </div>

      {/* Dates */}
      {routeID && (
        <div className="mb-6">
          <label className="mb-2 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70">
            Pickup date
          </label>
          {loadingDates ? (
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">Loading available dates...</p>
          ) : dates.length === 0 ? (
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">No dates available for this address.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {dates.slice(0, 6).map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-center font-[family-name:var(--font-poppins)] text-sm transition-all",
                    selectedDate === d.date
                      ? "border-primary bg-primary text-white"
                      : "border-navy/10 bg-white text-navy hover:border-primary/40",
                  )}
                >
                  {formatDate(d.date)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Time slots */}
      {selectedDate && (
        <div className="mb-6">
          <label className="mb-2 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70">
            Pickup window
          </label>
          {loadingSlots ? (
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">Loading time slots...</p>
          ) : slots.length === 0 ? (
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/40">No slots available for this date.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
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
                  {formatSlot(slot)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Button
        className="w-full"
        onClick={onComplete}
      >
        Continue to Payment
      </Button>

      {hasSchedule ? (
        <p className="mt-3 text-center font-[family-name:var(--font-poppins)] text-[11px] text-navy/30">
          First pickup {formatDate(selectedDate!)} {selectedSlot}
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
