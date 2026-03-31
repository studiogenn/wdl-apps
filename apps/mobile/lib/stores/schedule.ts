import { create } from "zustand";
import { DateEntry, Product } from "@/lib/api/cleancloud";

type ScheduleState = {
  readonly address: string;
  readonly routeID: number | null;
  readonly availableDates: readonly DateEntry[];
  readonly selectedDate: number | null;
  readonly availableSlots: readonly string[];
  readonly selectedSlot: string | null;
  readonly products: readonly Product[];
  readonly selectedProducts: readonly { readonly productID: number; readonly quantity: number }[];
  readonly orderNotes: string;
  readonly planType: "one-time" | "weekly" | null;
};

type ScheduleActions = {
  readonly setAddress: (address: string) => void;
  readonly setRouteID: (routeID: number) => void;
  readonly setAvailableDates: (dates: readonly DateEntry[]) => void;
  readonly setSelectedDate: (date: number) => void;
  readonly setAvailableSlots: (slots: readonly string[]) => void;
  readonly setSelectedSlot: (slot: string) => void;
  readonly setProducts: (products: readonly Product[]) => void;
  readonly toggleProduct: (productID: number) => void;
  readonly setOrderNotes: (notes: string) => void;
  readonly setPlanType: (type: "one-time" | "weekly") => void;
  readonly reset: () => void;
};

const initialState: ScheduleState = {
  address: "",
  routeID: null,
  availableDates: [],
  selectedDate: null,
  availableSlots: [],
  selectedSlot: null,
  products: [],
  selectedProducts: [],
  orderNotes: "",
  planType: null,
};

export const useScheduleStore = create<ScheduleState & ScheduleActions>()((set, get) => ({
  ...initialState,
  setAddress: (address) => set({ address }),
  setRouteID: (routeID) => set({ routeID }),
  setAvailableDates: (availableDates) => set({ availableDates }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setAvailableSlots: (availableSlots) => set({ availableSlots }),
  setSelectedSlot: (selectedSlot) => set({ selectedSlot }),
  setProducts: (products) => set({ products }),
  toggleProduct: (productID) => {
    const current = get().selectedProducts;
    const exists = current.find((p) => p.productID === productID);
    if (exists) {
      set({ selectedProducts: current.filter((p) => p.productID !== productID) });
    } else {
      set({ selectedProducts: [...current, { productID, quantity: 1 }] });
    }
  },
  setOrderNotes: (orderNotes) => set({ orderNotes }),
  setPlanType: (planType) => set({ planType }),
  reset: () => set(initialState),
}));
