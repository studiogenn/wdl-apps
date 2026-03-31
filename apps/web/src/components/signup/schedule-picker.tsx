"use client";

import { useEffect, useState } from "react";
import { fromCleanCloudTimestamp } from "@/lib/cleancloud/dates";
import { Button } from "@/components/shared";

type DateEntry = {
  readonly date: number;
  readonly remaining?: number;
};

type SchedulePickerProps = {
  readonly routeID: number;
  readonly onSubmit: (pickupDate: number, pickupStart: string, pickupEnd: string) => void;
  readonly onBack: () => void;
  readonly loading?: boolean;
  readonly error?: string;
};

export function SchedulePicker({ routeID, onSubmit, onBack, loading, error }: SchedulePickerProps) {
  const [dates, setDates] = useState<ReadonlyArray<DateEntry>>([]);
  const [slots, setSlots] = useState<ReadonlyArray<string>>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    async function fetchDates() {
      try {
        const res = await fetch("/api/cleancloud/scheduling/dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ routeID }),
        });
        const data = await res.json();
        if (data.success) {
          setDates(data.data.dates);
        } else {
          setFetchError(data.error);
        }
      } catch {
        setFetchError("Unable to load available dates.");
      } finally {
        setLoadingDates(false);
      }
    }
    fetchDates();
  }, [routeID]);

  useEffect(() => {
    if (!selectedDate) return;

    async function fetchSlots() {
      setLoadingSlots(true);
      setSlots([]);
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
        // Slots fetch failed — user can retry by selecting another date
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [routeID, selectedDate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    // Use selected slot as start, and next slot or +2h as end
    const slotIndex = slots.indexOf(selectedSlot);
    const endSlot = slotIndex < slots.length - 1 ? slots[slotIndex + 1] : selectedSlot;

    onSubmit(selectedDate, selectedSlot, endSlot ?? selectedSlot);
  }

  function formatDate(timestamp: number): string {
    const date = fromCleanCloudTimestamp(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  if (loadingDates) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-heading-medium text-navy mb-2">Schedule Pickup</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-navy/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-heading-medium text-navy mb-2">Schedule Pickup</h2>
      <p className="text-sm text-navy/60 font-[family-name:var(--font-poppins)] mb-6">
        Choose a day and time for your first pickup.
      </p>

      {fetchError && (
        <p className="mb-4 text-sm text-red-600 font-[family-name:var(--font-poppins)]">{fetchError}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-xs font-body-medium text-navy/70 font-[family-name:var(--font-poppins)]">
            Available Dates
          </label>
          <div className="grid grid-cols-2 gap-2">
            {dates.slice(0, 8).map((entry) => (
              <button
                key={entry.date}
                type="button"
                onClick={() => setSelectedDate(entry.date)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-[family-name:var(--font-poppins)] transition-colors ${
                  selectedDate === entry.date
                    ? "border-primary bg-primary/5 text-primary font-body-medium"
                    : "border-navy/10 text-navy hover:border-navy/25"
                }`}
              >
                <span className="block">{formatDate(entry.date)}</span>
                {entry.remaining !== undefined && entry.remaining <= 5 && (
                  <span className="text-[10px] text-amber-600">
                    {entry.remaining} spot{entry.remaining !== 1 ? "s" : ""} left
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div>
            <label className="mb-2 block text-xs font-body-medium text-navy/70 font-[family-name:var(--font-poppins)]">
              Time Slot
            </label>
            {loadingSlots ? (
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-navy/5" />
                ))}
              </div>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border px-3 py-2.5 text-center text-sm font-[family-name:var(--font-poppins)] transition-colors ${
                      selectedSlot === slot
                        ? "border-primary bg-primary/5 text-primary font-body-medium"
                        : "border-navy/10 text-navy hover:border-navy/25"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-navy/50 font-[family-name:var(--font-poppins)]">
                No time slots available for this date.
              </p>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 font-[family-name:var(--font-poppins)]">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-full border border-navy/15 px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-body-medium text-navy hover:bg-navy/5 transition-colors"
          >
            Back
          </button>
          <Button
            type="submit"
            disabled={!selectedDate || !selectedSlot || loading}
            className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Scheduling..." : "Schedule Pickup"}
          </Button>
        </div>
      </form>
    </div>
  );
}
