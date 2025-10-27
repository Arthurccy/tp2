"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { RegisterForm } from "@/app/components/auth/RegisterForm";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // 🔒 Redirige si déjà connecté
  useEffect(() => {
    if (user) router.push("/pages/articles");
  }, [user, router]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
      <RegisterForm />
    </div>
  );
}
