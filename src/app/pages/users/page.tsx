"use client";

import { useUserStore } from "@/app/store/userStore";
import UsersList from "@/app/components/users/UserList";

export default function UsersPage() {
  const users = useUserStore((s) => s.users); // ✅ Store Zustand persisté

  return (
    <main>
      <UsersList users={users} />
    </main>
  );
}
