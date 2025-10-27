// src/app/hooks/useRequireAuth.ts
"use client";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/pages/auth");
  }, [user, router]);

  return user;
}
