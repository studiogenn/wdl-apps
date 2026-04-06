"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { type ScheduleState, type PageView } from "./pricing-data";
import { AddressInput } from "@/components/account/address-input";

const TIME_SLOTS = ["8am - 12pm", "8pm - 11pm"];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getAvailableDates(): { iso: string; day: string; date: number; month: string; label?: string }[] {
  const dates = [];
  const today = new Date();
  // Start from tomorrow, show next 10 days, skip Sundays
  for (let i = 1; dates.length < 8; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0) continue; // skip Sundays
    const iso = d.toISOString().split("T")[0];
    dates.push({
      iso,
      day: DAY_NAMES[d.getDay()],
      date: d.getDate(),
      month: MONTH_NAMES[d.getMonth()],
      label: i === 1 ? "tomorrow" : undefined,
    });
  }
  return dates;
}

interface SchedulePickerProps {
  state: ScheduleState;
  onChange: (next: ScheduleState) => void;
  onNavigate: (page: PageView) => void;
  onCheckout: () => void;
  checkoutLoading: boolean;
  checkoutError: string | null;
}

export function SchedulePicker({ state, onChange, onNavigate, onCheckout, checkoutLoading, checkoutError }: SchedulePickerProps) {
  const dates = useMemo(() => getAvailableDates(), []);

  const update = (partial: Partial<ScheduleState>) => onChange({ ...state, ...partial });

  const handleAddressChange = (address: string) => {
    update({ address, routeID: null });
  };

  const handleAddressValidated = (routeID: number) => {
    update({ routeID });
  };

  const handleAddressInvalid = () => {
    update({ routeID: null });
  };

  const canContinue = state.date && state.timeSlot && state.address && state.routeID;

  return (
    <div>
      {/* Header */}
      <div className="relative overflow-hidden bg-primary px-5 pb-9 pt-7 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg viewBox="0 0 400 200" preserveAspectRatio="none" fill="none" className="h-full w-full opacity-[0.08]">
            <path d="M-50 140 Q100 60 200 120 Q300 180 450 100" stroke="#fff" strokeWidth="20" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("subscription")}
          className="absolute left-4 top-7 z-20 flex items-center gap-1 text-[13px] font-medium text-white/80 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <div className="relative z-10">
          <h2 className="text-2xl font-normal uppercase tracking-[1.5px] text-white">Pickup Date & Time</h2>
          <p className="mt-1.5 text-[13px] text-white/65">Choose your first pickup window</p>
        </div>
      </div>

      <div className="mx-auto max-w-[500px] px-4 pb-28">

        {/* Pickup address */}
        <div className="mt-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#0a1580]/60">Pickup Address</p>
          <AddressInput
            value={state.address}
            onChange={handleAddressChange}
            onValidated={handleAddressValidated}
            onInvalid={handleAddressInvalid}
          />
        </div>

        <hr className="my-6 border-[#e8e5d0]" />

        {/* When would you like your pickup? */}
        <p className="mb-4 text-center text-[15px] text-[#0a1580]">When would you like your pickup?</p>

        {/* Date selector */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {dates.map((d) => {
            const selected = state.date === d.iso;
            return (
              <button
                key={d.iso}
                onClick={() => update({ date: d.iso })}
                className={cn(
                  "shrink-0 w-[76px] rounded-[14px] border-[1.5px] px-2 py-3.5 text-center transition-all",
                  selected
                    ? "border-[#d4b93c] bg-[#F9EBAA]"
                    : "border-[#e8e5d0] bg-white hover:border-primary hover:bg-[#f0f3ff]",
                )}
              >
                <span className={cn("block text-lg font-bold", selected ? "text-[#0a1580]" : "text-primary")}>
                  {d.day}
                </span>
                <span className={cn("block text-[11px] font-semibold mt-0.5", selected ? "text-[#0a1580]" : "text-[#0a1580]")}>
                  {d.date} {d.month.toUpperCase()}
                </span>
                {d.label && (
                  <span className={cn("block text-[10px] mt-1", selected ? "text-[#8a6f00]" : "text-[#6b7db3]")}>
                    {d.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Time slots */}
        <p className="mt-6 mb-3 text-center text-[13px] text-[#6b7db3]">Available time slots</p>
        <div className="flex gap-3">
          {TIME_SLOTS.map((slot) => {
            const selected = state.timeSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => update({ timeSlot: slot })}
                className={cn(
                  "flex-1 rounded-[14px] border-[1.5px] py-3 text-center text-[14px] font-semibold transition-all",
                  selected
                    ? "border-[#d4b93c] bg-[#F9EBAA] text-[#0a1580]"
                    : "border-[#e8e5d0] bg-white text-primary hover:border-primary hover:bg-[#f0f3ff]",
                )}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {/* Repeat Pickup toggle */}
        <div className="mt-4 flex items-center justify-between rounded-[14px] border-[1.5px] border-[#e8e5d0] bg-[#f5f5f5] px-4 py-3.5">
          <span className="text-[14px] font-semibold text-[#0a1580]">Repeat Pickup</span>
          <button
            onClick={() => update({ repeatPickup: !state.repeatPickup })}
            className={cn(
              "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
              state.repeatPickup ? "bg-primary" : "bg-[#d1d5db]",
            )}
            aria-label="Toggle repeat pickup"
          >
            <span
              className={cn(
                "absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-all duration-200",
                state.repeatPickup ? "left-[calc(100%-25px)]" : "left-[3px]",
              )}
            />
          </button>
        </div>
        {state.repeatPickup && (
          <p className="mt-1.5 text-center text-[11px] text-[#6b7db3]">
            We&apos;ll use this time window for every pickup on your plan.
          </p>
        )}

        {/* Error */}
        {checkoutError && (
          <p className="mt-4 rounded-[10px] bg-red-50 px-4 py-3 text-center text-[13px] text-red-600">{checkoutError}</p>
        )}

        {/* Continue button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 px-4 pb-6 pt-3 backdrop-blur-sm">
          <div className="mx-auto max-w-[500px]">
            <button
              onClick={onCheckout}
              disabled={!canContinue || checkoutLoading}
              className={cn(
                "w-full rounded-[14px] py-4 text-[15px] font-bold uppercase tracking-[1.5px] transition-all",
                canContinue && !checkoutLoading
                  ? "bg-[#F9EBAA] text-[#0a1580] hover:bg-[#f0d96a]"
                  : "bg-[#e8e5d0] text-[#9ca3af] cursor-not-allowed",
              )}
            >
              {checkoutLoading ? "Loading…" : "Continue"}
            </button>
          </div>
        </div>

        <button
          onClick={() => onNavigate("subscription")}
          className="mt-4 w-full py-2 text-center text-[13px] text-[#6b7db3] hover:text-primary"
        >
          ← Back to plan
        </button>
      </div>
    </div>
  );
}
