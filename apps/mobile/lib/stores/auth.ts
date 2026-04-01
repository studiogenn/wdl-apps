import { create } from "zustand";
import type { User } from "@wdl/api";

type AuthState = {
  readonly user: User | null;
  readonly cleancloudCustomerId: number | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
};

type AuthActions = {
  readonly setUser: (user: User | null) => void;
  readonly setCleancloudCustomerId: (id: number | null) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly reset: () => void;
};

const initialState: AuthState = {
  user: null,
  cleancloudCustomerId: null,
  isLoading: true,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
      isLoading: false,
      cleancloudCustomerId: user?.cleancloudCustomerId ?? null,
    }),
  setCleancloudCustomerId: (cleancloudCustomerId) =>
    set({ cleancloudCustomerId }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}));
