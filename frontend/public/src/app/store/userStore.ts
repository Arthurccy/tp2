// src/app/store/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/app/lib/types";
import { mockUsers } from "@/app/lib/mockData";

// ✅ Génère un ID unique (fallback si crypto non dispo)
const generateId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 10);

interface UserState {
  users: User[];
  currentUserId: string;
  setCurrentUser: (id: string) => void;
  addUser: (user: Omit<User, "id" | "role">) => void;
  updateUser: (id: string, updated: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserByEmail: (email: string) => User | undefined;
}

// ✅ Création du store Zustand avec persistance
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: mockUsers,
      currentUserId: mockUsers[0]?.id ?? "",

      setCurrentUser: (id) => set({ currentUserId: id }),

      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              ...user,
              id: generateId(),
              role: "user",
              pp: user.pp || "",
              sujet: user.sujet ?? "",
            },
          ],
        })),

      updateUser: (id, updated) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...updated } : u
          ),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      getUserByEmail: (email) => get().users.find((u) => u.email === email),
    }),

    {
      name: "user-storage",
      version: 1,

      // ✅ migration typée
      migrate: (
        persistedState: unknown,
        version: number
      ): Pick<UserState, "users" | "currentUserId"> => {
        console.log("🧩 Migrating user-store from version", version);

        if (typeof persistedState === "object" && persistedState !== null) {
          const state = persistedState as Partial<UserState>;
          return {
            users: state.users ?? mockUsers,
            currentUserId: state.currentUserId ?? (mockUsers[0]?.id ?? ""),
          };
        }

        return {
          users: mockUsers,
          currentUserId: mockUsers[0]?.id ?? "",
        };
      },

      // ✅ évite les erreurs SSR
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

// ✅ Force la réhydratation / écriture en localStorage au premier rendu client
if (typeof window !== "undefined") {
  useUserStore.persist.rehydrate();
  const current = useUserStore.getState();
  // petit "touch" pour déclencher l’écriture
  useUserStore.setState({ users: current.users });
}
