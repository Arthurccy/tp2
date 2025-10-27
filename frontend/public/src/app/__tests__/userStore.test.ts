/**
 * @file userStore.test.ts
 * 🧪 Tests unitaires du store Zustand : useUserStore
 */

import { act } from "react";
import { useUserStore } from "../store/userStore";
import { mockUsers } from "../lib/mockData";

// Mock localStorage pour Jest
beforeAll(() => {
  const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = String(value);
      },
      clear: () => {
        store = {};
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  })();

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
});

describe("🧩 useUserStore", () => {
  beforeEach(() => {
    // Réinitialisation avant chaque test
    useUserStore.setState({ users: mockUsers, currentUserId: mockUsers[0].id });
  });

  it("✅ initialise le store avec les mockUsers", () => {
    const { users } = useUserStore.getState();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty("email");
  });

  it("✅ setCurrentUser doit modifier l'utilisateur courant", () => {
    const { setCurrentUser } = useUserStore.getState();

    act(() => {
      setCurrentUser("test-id-123");
    });

    expect(useUserStore.getState().currentUserId).toBe("test-id-123");
  });

  it("✅ addUser doit ajouter un utilisateur avec un id et un rôle par défaut", () => {
    const { addUser } = useUserStore.getState();

    act(() => {
      addUser({
        username: "Nouveau",
        email: "nouveau@example.com",
        password: "123456",
        sujet: "Next.js",
      });
    });

    const { users } = useUserStore.getState();
    const addedUser = users.find((u) => u.email === "nouveau@example.com");

    expect(addedUser).toBeDefined();
    expect(addedUser?.role).toBe("user");
    expect(addedUser?.id).toBeDefined();
  });

  it("✅ updateUser doit modifier les propriétés d’un utilisateur", () => {
    const { users, updateUser } = useUserStore.getState();
    const userToUpdate = users[0];

    act(() => {
      updateUser(userToUpdate.id, { username: "Nouvelle Valeur" });
    });

    const updated = useUserStore
      .getState()
      .users.find((u) => u.id === userToUpdate.id);

    expect(updated?.username).toBe("Nouvelle Valeur");
  });

  it("✅ deleteUser doit supprimer un utilisateur par id", () => {
    const { users, deleteUser } = useUserStore.getState();
    const initialCount = users.length;
    const idToDelete = users[0].id;

    act(() => {
      deleteUser(idToDelete);
    });

    const remaining = useUserStore.getState().users;
    expect(remaining.length).toBe(initialCount - 1);
    expect(remaining.find((u) => u.id === idToDelete)).toBeUndefined();
  });

  it("✅ getUserByEmail doit retourner le bon utilisateur", () => {
    const { users, getUserByEmail } = useUserStore.getState();
    const testEmail = users[0].email;
    const found = getUserByEmail(testEmail);

    expect(found).toBeDefined();
    expect(found?.email).toBe(testEmail);
  });

  it("⚙️ addUser doit définir sujet à 'empty' si non fourni", () => {
    const { addUser } = useUserStore.getState();

    act(() => {
      addUser({
        username: "SansSujet",
        email: "sanssujet@example.com",
        password: "1234",
        sujet: undefined as unknown as string, // simulate missing field
      });
    });

    const added = useUserStore
      .getState()
      .users.find((u) => u.email === "sanssujet@example.com");

    expect(added?.sujet).toBe("empty");
  });
});
