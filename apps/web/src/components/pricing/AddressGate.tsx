"use client";

import { useState, useCallback, type ReactNode } from "react";
import { AddressInput } from "@/components/account/address-input";

interface AddressGateProps {
  readonly children: ReactNode;
}

export function AddressGate({ children }: AddressGateProps) {
  const [routeID, setRouteID] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = useCallback((addr: string) => {
    setAddress(addr);
    setRouteID(null);
  }, []);

  const handleValidated = useCallback((id: number) => {
    setRouteID(id);
  }, []);

  const handleInvalid = useCallback(() => {
    setRouteID(null);
  }, []);

  if (confirmed) return <>{children}</>;

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-cream px-5">
      <div className="w-full max-w-[440px]">
        <h1 className="mb-2 text-center text-3xl font-normal uppercase tracking-[1.5px] text-primary">
          Check your address
        </h1>
        <p className="mb-8 text-center text-sm text-navy/60">
          Enter your address to confirm we deliver to your area.
        </p>

        <AddressInput
          value={address}
          onChange={handleChange}
          onValidated={handleValidated}
          onInvalid={handleInvalid}
        />

        <button
          type="button"
          disabled={routeID === null}
          onClick={() => setConfirmed(true)}
          className="mt-6 w-full rounded-full bg-primary px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          View Plans
        </button>
      </div>
    </div>
  );
}
