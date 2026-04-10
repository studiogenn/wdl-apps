"use client";

import { useState, useCallback } from "react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

// Bounding box: NYC + North Jersey metro area
const BBOX = [-74.5, 40.4, -73.7, 41.2];

type Suggestion = {
  readonly place_name: string;
  readonly center: readonly [number, number];
};

type AddressInputProps = {
  readonly value: string;
  readonly onChange: (address: string) => void;
  readonly onValidated: (routeID: number) => void;
  readonly onInvalid: () => void;
  readonly hideLabel?: boolean;
};

export function AddressInput({ value, onChange, onValidated, onInvalid, hideLabel }: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<readonly Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validating, setValidating] = useState(false);
  const [notInArea, setNotInArea] = useState(false);
  const [inArea, setInArea] = useState(false);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const params = new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        types: "address",
        country: "US",
        bbox: BBOX.join(","),
        autocomplete: "true",
        limit: "5",
      });
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`
      );
      const data = await res.json();
      setSuggestions(
        (data.features ?? []).map((f: { place_name: string; center: [number, number] }) => ({
          place_name: f.place_name,
          center: f.center,
        }))
      );
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleSelect = useCallback(async (suggestion: Suggestion) => {
    onChange(suggestion.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
    setNotInArea(false);
    setInArea(false);
    setValidating(true);

    try {
      const res = await fetch("/api/cleancloud/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: suggestion.center[1],
          lng: suggestion.center[0],
        }),
      });
      const data = await res.json();

      if (data.success) {
        setInArea(true);
        onValidated(data.data.routeID);
      } else {
        setNotInArea(true);
        onInvalid();
      }
    } catch {
      setNotInArea(true);
      onInvalid();
    } finally {
      setValidating(false);
    }
  }, [onChange, onValidated, onInvalid]);

  return (
    <div className="relative">
      {!hideLabel && (
        <label
          htmlFor="signup-address"
          className="mb-1 block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/70"
        >
          Address
        </label>
      )}
      <input
        id="signup-address"
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setNotInArea(false);
          setInArea(false);
          fetchSuggestions(e.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Start typing your address"
        autoComplete="off"
        className="w-full rounded-xl border border-navy/15 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm text-navy placeholder:text-navy/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
          {suggestions.map((s) => (
            <li key={s.place_name}>
              <button
                type="button"
                onMouseDown={() => handleSelect(s)}
                className="w-full px-4 py-3 text-left font-[family-name:var(--font-poppins)] text-sm text-navy hover:bg-cream transition-colors"
              >
                {s.place_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {validating && (
        <p className="mt-1 font-[family-name:var(--font-poppins)] text-xs text-navy/50">
          Checking service area...
        </p>
      )}

      {inArea && (
        <p className="mt-1 font-[family-name:var(--font-poppins)] text-xs text-green-600">
          Great news — we serve your area!
        </p>
      )}

      {notInArea && (
        <p className="mt-1 font-[family-name:var(--font-poppins)] text-xs text-red-600">
          Sorry, we don&apos;t serve this address yet.
        </p>
      )}
    </div>
  );
}
