import { act } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useUserStore } from "@/app/store/userStore";

beforeEach(() => {
  const authStore = useAuthStore.getState();
  const userStore = useUserStore.getState();

  // Réinitialise les stores Zustand avant chaque test
  authStore.logout();
  userStore.users = [];
});

describe("🧪 AuthStore", () => {
  it("doit permettre d'ajouter un utilisateur", () => {
    const { addUser } = useUserStore.getState();

    act(() => {
      addUser({
        username: "Alice",
        email: "alice@example.com",
        password: "1234",
      });
    });

    const { users } = useUserStore.getState();
    expect(users.length).toBe(1);
    expect(users[0].email).toBe("alice@example.com");
    expect(users[0].role).toBe("user");
  });

  it("doit connecter un utilisateur avec email/mot de passe valides", async () => {
    const { addUser } = useUserStore.getState();
    const { login } = useAuthStore.getState();

    act(() => {
      addUser({
        username: "Bob",
        email: "bob@example.com",
        password: "secret",
      });
    });

    const success = await act(async () => login("bob@example.com", "secret"));
    expect(success).toBeTruthy();

    const connectedUser = useAuthStore.getState().user;
    expect(connectedUser?.email).toBe("bob@example.com");
  });

  it("doit refuser une connexion avec un mauvais mot de passe", async () => {
    const { addUser } = useUserStore.getState();
    const { login } = useAuthStore.getState();

    act(() => {
      addUser({
        username: "Eve",
        email: "eve@example.com",
        password: "password",
      });
    });

    const success = await act(async () => login("eve@example.com", "wrongpass"));
    expect(success).toBeFalsy();

    const connectedUser = useAuthStore.getState().user;
    expect(connectedUser).toBeNull();
  });

  it("doit déconnecter l'utilisateur", () => {
    const { addUser } = useUserStore.getState();
    const { login, logout } = useAuthStore.getState();

    act(() => {
      addUser({
        username: "John",
        email: "john@example.com",
        password: "azerty",
      });
      login("john@example.com", "azerty");
      logout();
    });

    const userAfterLogout = useAuthStore.getState().user;
    expect(userAfterLogout).toBeNull();
  });
});
