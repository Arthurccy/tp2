// src/app/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/app/lib/types";
import { useUserStore } from "./userStore";

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      // 🔐 Login : cherche dans userStore et met à jour auth
      login: (email, password) => {
        const { getUserByEmail } = useUserStore.getState();
        const found = getUserByEmail(email);

        if (found && found.password === password) {
          set({ user: found });
          return true;
        }
        return false;
      },

      // 🚪 Logout
      logout: () => set({ user: null }),

      // 🧠 Setter manuel (utile quand on édite le profil)
      setUser: (user) => set({ user }),
    }),

    {
      name: "auth-storage",

      // ✅ Correction : empêche SSR d’accéder à localStorage
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }

        // fallback neutre côté serveur
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
