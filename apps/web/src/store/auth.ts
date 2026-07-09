import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthTokens, UserSession } from "@urbanair/shared";

interface AuthState {
  tokens: AuthTokens | null;
  user: UserSession | null;
  isAuthenticated: boolean;
  setAuth: (tokens: AuthTokens, user: UserSession) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: null,
      user: null,
      isAuthenticated: false,
      setAuth: (tokens, user) => set({ tokens, user, isAuthenticated: true }),
      clearAuth: () => set({ tokens: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "urbanair-auth-storage",
    }
  )
);
