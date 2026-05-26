import { AuthStore } from "@/store/auth/auth.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export const authStore = create(
  persist<AuthStore>(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
