"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared";
import { cn } from "@/lib/cn";
import { OrderSummary, type OrderPayload } from "./order-summary";
import { toCleanCloudTimestamp } from "@/lib/cleancloud/dates";

// ─── Types ──────────────────────────────────────────────────────────────────

type Slot = {
  readonly start: string;
  readonly end: string;
};

type DateEntry = {
  readonly date: string;
  readonly slots: readonly Slot[];
};

type Preferences = {
  readonly current: {
    readonly detergent: string | null;
    readonly bleach: string | null;
    readonly fabricSoftener: string | null;
    readonly dryerTemperature: string | null;
    readonly dryerSheets: string | null;
  };
  readonly options: Readonly<Record<string, readonly string[]>>;
};

type ScheduleData = {
  readonly routeId: number;
  readonly dates: ReadonlyArray<DateEntry>;
  readonly preferences: Preferences;
};

type Step = "calendar" | "summary" | "confirmed";

// ─── Constants ──────────────────────────────────────────────────────────────

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(date);
  check.setHours(0, 0, 0, 0);
  return check < today;
}

function buildCalendarCells(year: number, month: number): ReadonlyArray<number | null> {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null) as null[],
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatSlotLabel(slot: Slot): string {
  return `${slot.start} - ${slot.end}`;
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// ─── Component ──────────────────────────────────────────────────────────────

type ScheduleCalendarProps = {
  readonly customerId: number;
};

export function ScheduleCalendar({ customerId }: ScheduleCalendarProps) {
  const router = useRouter();
  const today = new Date();

  // Data state
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Calendar navigation
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [animKey, setAnimKey] = useState(0);

  // Selection
  const [selectedDate, setSelectedDate] = useState<DateEntry | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Flow step
  const [step, setStep] = useState<Step>("calendar");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmedOrderId, setConfirmedOrderId] = useState<number | null>(null);

  // Map ISO date strings to DateEntry for calendar rendering
  const availableDateMap = new Map<string, DateEntry>();
  if (scheduleData) {
    for (const entry of scheduleData.dates) {
      const d = parseISODate(entry.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      availableDateMap.set(key, entry);
    }
  }

  // ─── Fetch schedule data ────────────────────────────────────────────────

  useEffect(() => {
    async function fetchScheduleData() {
      try {
        const res = await fetch("/api/account/schedule-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
          setScheduleData(data.data);
        } else {
          setError(data.error ?? "Unable to load scheduling data");
        }
      } catch {
        setError("Unable to load scheduling data");
      } finally {
        setLoading(false);
      }
    }
    fetchScheduleData();
  }, []);

  // ─── Calendar navigation ────────────────────────────────────────────────

  const navigate = useCallback((dir: "prev" | "next") => {
    setAnimDir(dir === "next" ? "right" : "left");
    setAnimKey((k) => k + 1);
    if (dir === "next") {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      } else {
        setViewMonth((m) => m + 1);
      }
    } else {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((y) => y - 1);
      } else {
        setViewMonth((m) => m - 1);
      }
    }
  }, [viewMonth]);

  const goToday = useCallback(() => {
    const fwd =
      viewYear > today.getFullYear() ||
      (viewYear === today.getFullYear() && viewMonth > today.getMonth());
    setAnimDir(fwd ? "left" : "right");
    setAnimKey((k) => k + 1);
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
  }, [viewYear, viewMonth, today]);

  // ─── Date selection ─────────────────────────────────────────────────────

  const handleDateClick = useCallback((day: number) => {
    const key = `${viewYear}-${viewMonth}-${day}`;
    const entry = availableDateMap.get(key);
    if (!entry) return;
    setSelectedDate(entry);
    setSelectedSlot(null);
    setSubmitError("");
  }, [viewYear, viewMonth, availableDateMap]);

  // ─── Proceed to summary ─────────────────────────────────────────────────

  const handleContinue = useCallback(() => {
    if (!selectedDate || !selectedSlot) return;
    setStep("summary");
    setSubmitError("");
  }, [selectedDate, selectedSlot]);

  // ─── Back to calendar ───────────────────────────────────────────────────

  const handleBackToCalendar = useCallback(() => {
    setStep("calendar");
    setSubmitError("");
  }, []);

  // ─── Submit order ───────────────────────────────────────────────────────

  const handleSubmitOrder = useCallback(async (order: OrderPayload) => {
    if (!selectedDate || !selectedSlot || !scheduleData) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      // Step 1: Create Stripe PaymentIntent (manual capture)
      const stripeRes = await fetch("/api/stripe/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents: 2999, // PAYG minimum hold
          description: `PAYG Pickup – ${selectedDate.date} ${formatSlotLabel(selectedSlot)}${order.deepClean ? " + Deep Clean" : ""}`,
        }),
      });
      const stripeData = await stripeRes.json();

      if (!stripeData.success) {
        setSubmitError(stripeData.error ?? "Payment setup failed");
        return;
      }

      const { paymentIntentId } = stripeData.data;

      // Step 2: Push to CleanCloud for ops
      const ccNotes = [
        `Stripe PI: ${paymentIntentId}`,
        order.deepClean ? "Deep Clean requested (+$0.45/lb)" : "",
        order.notes,
      ].filter(Boolean).join("\n");

      // Convert ISO date string to Unix timestamp (noon UTC, as CleanCloud expects)
      const pickupTimestamp = toCleanCloudTimestamp(parseISODate(selectedDate.date));

      const ccRes = await fetch("/api/cleancloud/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerID: customerId,
          pickupDate: pickupTimestamp,
          pickupStart: selectedSlot.start,
          pickupEnd: selectedSlot.end,
          orderNotes: ccNotes,
        }),
      });

      const ccData = await ccRes.json();

      if (!ccRes.ok || !ccData.success) {
        console.error("CleanCloud order failed:", ccData);
        setSubmitError(ccData.error ?? "Order scheduling failed. Please try again.");
        return;
      }

      setConfirmedOrderId(ccData.data?.orderID ?? null);
      setStep("confirmed");
    } catch {
      setSubmitError("Unable to schedule pickup. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [selectedDate, selectedSlot, scheduleData, customerId]);

  // ─── Reset ──────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    setSelectedDate(null);
    setSelectedSlot(null);
    setStep("calendar");
    setSubmitError("");
    setConfirmedOrderId(null);
  }, []);

  // ─── Calendar grid ──────────────────────────────────────────────────────

  const cells = buildCalendarCells(viewYear, viewMonth);

  const selectedDateObj = selectedDate
    ? parseISODate(selectedDate.date)
    : null;

  // ─── Loading state ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-navy/10 bg-white overflow-hidden">
          <div className="p-8">
            <div className="h-6 w-48 animate-pulse rounded-lg bg-navy/5 mb-6" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-navy/5" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isAddressError = error.toLowerCase().includes("address") || error.toLowerCase().includes("delivery area");
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-navy/10 bg-white p-8 text-center">
          {isAddressError ? (
            <>
              <h3 className="text-lg font-heading-medium text-navy mb-2">Update your address</h3>
              <p className="text-sm text-navy/60 font-[family-name:var(--font-poppins)] mb-4">
                We need a valid address in our service area to schedule pickups. Please update your address or contact us for help.
              </p>
              <p className="text-sm text-navy/60 font-[family-name:var(--font-poppins)] mb-6">
                Text <a href="sms:+18559685511" className="text-primary font-body-medium">(855) 968-5511</a> or email <a href="mailto:hello@wedeliverlaundry.com" className="text-primary font-body-medium">hello@wedeliverlaundry.com</a>
              </p>
            </>
          ) : (
            <p className="text-sm text-red-600 font-body mb-4">{error}</p>
          )}
          <Button variant="outline" onClick={() => router.push("/account")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // ─── Order summary step ─────────────────────────────────────────────────

  if (step === "summary" && selectedDate && selectedSlot && scheduleData) {
    return (
      <OrderSummary
        pickupDate={selectedDate.date}
        pickupSlot={formatSlotLabel(selectedSlot)}
        preferences={scheduleData.preferences}
        onBack={handleBackToCalendar}
        onSubmit={handleSubmitOrder}
        submitting={submitting}
        submitError={submitError}
      />
    );
  }

  // ─── Confirmed step ────────────────────────────────────────────────────

  if (step === "confirmed" && selectedDateObj && selectedSlot) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-navy/10 bg-white overflow-hidden">
          <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-200">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M7.5 14l5 5 8-9" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-heading-medium text-navy mb-1">Pickup Scheduled</h2>
              <p className="text-sm text-navy/50 font-body">
                {formatSlotLabel(selectedSlot)} &middot; {formatDateLabel(selectedDateObj)}
              </p>
              {confirmedOrderId && (
                <p className="text-xs text-navy/40 font-body mt-1">
                  Order #{confirmedOrderId}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Schedule Another
              </Button>
              <Button size="sm" onClick={() => router.push("/account")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Calendar step ──────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <button
        onClick={() => router.push("/account")}
        className="mb-4 flex items-center gap-1 font-[family-name:var(--font-poppins)] text-sm text-navy/50 hover:text-primary transition-colors"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>
      <div className="flex flex-col md:flex-row rounded-2xl border border-navy/10 bg-white overflow-hidden shadow-sm">
        {/* ─── LEFT: Calendar ──────────────────────────────────────── */}
        <div className="md:w-[340px] shrink-0 border-b md:border-b-0 md:border-r border-navy/10 p-7 flex flex-col gap-5">
          {/* Month + nav */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-heading-medium text-navy leading-none">
                {MONTHS[viewMonth]}
              </h2>
              <span className="mt-1 block text-xs text-navy/40 tracking-wider font-body">
                {viewYear}
              </span>
            </div>
            <div className="flex gap-1.5 mt-1">
              <button
                onClick={() => navigate("prev")}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/10 text-navy/40 transition-colors hover:text-primary hover:border-primary/30"
                aria-label="Previous month"
              >
                &#8249;
              </button>
              <button
                onClick={() => navigate("next")}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/10 text-navy/40 transition-colors hover:text-primary hover:border-primary/30"
                aria-label="Next month"
              >
                &#8250;
              </button>
            </div>
          </div>

          {/* Day-of-week header */}
          <div className="grid grid-cols-7">
            {DOW.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] text-navy/30 tracking-wider font-body-medium py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div
            key={animKey}
            className={cn(
              "grid grid-cols-7 gap-0.5",
              animDir === "right" ? "animate-slide-right" : "animate-slide-left"
            )}
          >
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;

              const dateKey = `${viewYear}-${viewMonth}-${day}`;
              const entry = availableDateMap.get(dateKey);
              const isAvailable = !!entry;
              const cellDate = new Date(viewYear, viewMonth, day);
              const isToday_ = isSameDay(cellDate, today);
              const isPast_ = isPast(cellDate);
              const isSelected =
                selectedDateObj !== null && isSameDay(cellDate, selectedDateObj);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={!isAvailable || isPast_}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "relative flex flex-col items-center py-1 rounded-lg transition-colors",
                    isPast_ && "opacity-20 cursor-default",
                    !isPast_ && !isAvailable && "opacity-30 cursor-default",
                    !isPast_ && isAvailable && !isSelected && "cursor-pointer hover:bg-primary/5",
                    isSelected && "bg-primary text-white"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                      isSelected
                        ? "font-body-medium text-white"
                        : isToday_
                          ? "font-body-medium text-primary"
                          : "text-navy"
                    )}
                  >
                    {day}
                  </span>
                  {/* Availability dot */}
                  <div className="flex justify-center gap-1 h-1.5">
                    {isAvailable && !isSelected && (
                      <span className="block h-1 w-1 rounded-full bg-primary/50" />
                    )}
                  </div>
                  {/* Today indicator */}
                  {isToday_ && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 block h-0.5 w-0.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend + today */}
          <div className="flex items-center justify-between border-t border-navy/5 pt-3">
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5">
                <span className="block h-1.5 w-1.5 rounded-full bg-primary/50" />
                <span className="text-[10px] text-navy/40 font-body">Available</span>
              </div>
            </div>
            <button
              onClick={goToday}
              className="rounded-md border border-navy/10 px-2 py-0.5 text-[10px] text-navy/40 tracking-wider font-body transition-colors hover:text-primary hover:border-primary/30"
            >
              Today
            </button>
          </div>
        </div>

        {/* ─── RIGHT: Slot picker / empty ─────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-[400px] bg-cream/30">
          {/* Empty state */}
          {!selectedDate && (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-navy/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-navy/20">
                  <rect x="3" y="4" width="18" height="18" rx="2.5" />
                  <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-lg font-heading-medium text-navy">Pick a date</h3>
              <p className="text-sm text-navy/50 font-body">
                Select a day to see available pickup windows
              </p>
            </div>
          )}

          {/* Slot picker */}
          {selectedDate && selectedDateObj && (
            <div className="flex-1 flex flex-col p-7 gap-5">
              {/* Header */}
              <div>
                <span className="block text-[10px] text-navy/40 tracking-widest uppercase font-body-medium mb-1">
                  Scheduling for
                </span>
                <h3 className="text-xl font-heading-medium text-navy">
                  {formatDateLabel(selectedDateObj)}
                </h3>
              </div>

              {/* Slots grid */}
              {selectedDate.slots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {selectedDate.slots.map((slot) => {
                    const label = formatSlotLabel(slot);
                    const isOn = selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedSlot(isOn ? null : slot)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left text-sm font-body transition-all",
                          isOn
                            ? "border-primary bg-primary/5 text-primary font-body-medium"
                            : "border-navy/10 text-navy hover:border-navy/25 hover:shadow-sm"
                        )}
                      >
                        <span className="block text-sm">{label}</span>
                        {isOn && (
                          <span className="mt-0.5 block text-[10px] text-primary/60">Selected</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-navy/50 font-body">
                    No time slots available for this date.
                  </p>
                </div>
              )}

              {/* Continue strip */}
              {selectedSlot && (
                <div className="flex items-center gap-3 rounded-xl border border-navy/10 bg-white p-4">
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] text-navy/40 font-body">
                      Pickup &middot; {formatSlotLabel(selectedSlot)}
                    </span>
                    <span className="block text-sm font-heading-medium text-navy truncate">
                      {formatDateLabel(selectedDateObj)}
                    </span>
                  </div>
                  <Button onClick={handleContinue} size="sm">
                    Continue
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
