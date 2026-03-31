import { create } from "zustand";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { PhoneConfirmation } from "@/lib/auth/firebase";

type AuthState = {
  readonly user: FirebaseAuthTypes.User | null;
  readonly cleancloudCustomerId: number | null;
  readonly phoneConfirmation: PhoneConfirmation | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
};

type AuthActions = {
  readonly setUser: (user: FirebaseAuthTypes.User | null) => void;
  readonly setCleancloudCustomerId: (id: number | null) => void;
  readonly setPhoneConfirmation: (confirmation: PhoneConfirmation | null) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly reset: () => void;
};

const initialState: AuthState = {
  user: null,
  cleancloudCustomerId: null,
  phoneConfirmation: null,
  isLoading: true,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,
  setUser: (user) =>
    set({ user, isAuthenticated: user !== null, isLoading: false }),
  setCleancloudCustomerId: (cleancloudCustomerId) =>
    set({ cleancloudCustomerId }),
  setPhoneConfirmation: (phoneConfirmation) => set({ phoneConfirmation }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}));
