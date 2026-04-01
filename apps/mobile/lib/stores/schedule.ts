import { create } from "zustand";
import type { PlanType } from "@wdl/api";

type ScheduleState = {
  readonly address: string;
  readonly routeID: number | null;
  readonly selectedDate: number | null;
  readonly selectedSlot: string | null;
  readonly selectedProducts: readonly {
    readonly productID: number;
    readonly quantity: number;
  }[];
  readonly orderNotes: string;
  readonly planType: PlanType | null;
};

type ScheduleActions = {
  readonly setAddress: (address: string) => void;
  readonly setRouteID: (routeID: number) => void;
  readonly setSelectedDate: (date: number) => void;
  readonly setSelectedSlot: (slot: string) => void;
  readonly toggleProduct: (productID: number) => void;
  readonly setOrderNotes: (notes: string) => void;
  readonly setPlanType: (type: PlanType) => void;
  readonly reset: () => void;
};

const initialState: ScheduleState = {
  address: "",
  routeID: null,
  selectedDate: null,
  selectedSlot: null,
  selectedProducts: [],
  orderNotes: "",
  planType: null,
};

export const useScheduleStore = create<ScheduleState & ScheduleActions>()(
  (set, get) => ({
    ...initialState,
    setAddress: (address) => set({ address }),
    setRouteID: (routeID) => set({ routeID }),
    setSelectedDate: (selectedDate) => set({ selectedDate }),
    setSelectedSlot: (selectedSlot) => set({ selectedSlot }),
    toggleProduct: (productID) => {
      const current = get().selectedProducts;
      const exists = current.find((p) => p.productID === productID);
      if (exists) {
        set({
          selectedProducts: current.filter((p) => p.productID !== productID),
        });
      } else {
        set({
          selectedProducts: [...current, { productID, quantity: 1 }],
        });
      }
    },
    setOrderNotes: (orderNotes) => set({ orderNotes }),
    setPlanType: (planType) => set({ planType }),
    reset: () => set(initialState),
  })
);
