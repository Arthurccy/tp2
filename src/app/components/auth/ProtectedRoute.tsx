"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

const PUBLIC_ROUTES = [
  "/pages/auth/login",
  "/pages/auth/register",
  "/404",
  "/not-found",
];

const VALID_PATHS = [
  "/",
  "/pages/articles",
  "/pages/articles/create",
  "/pages/articles/[id]",
  "/pages/users",
  "/pages/users/[userId]",
  "/pages/auth/login",
  "/pages/auth/register",
  "/pages/stats",
];

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const [isClient, setIsClient] = useState(false);
  const [isKnownRoute, setIsKnownRoute] = useState(false);
  const [checkedRoute, setCheckedRoute] = useState(false);

  // ✅ 1. Vérifie si rendu côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ 2. Vérifie si la route correspond à une route connue
  useEffect(() => {
    const known = VALID_PATHS.some((route) => {
      if (route.includes("[")) {
        const base = route.split("/[").shift();
        return pathname.startsWith(base ?? "");
      }
      return pathname === route;
    });
    setIsKnownRoute(known);
    setCheckedRoute(true);
  }, [pathname]);

  // ✅ 3. Logique de redirection
  useEffect(() => {
    if (!isClient || !checkedRoute) return;

    // Routes publiques → OK
    if (PUBLIC_ROUTES.includes(pathname)) return;

    // Route inconnue → laisse Next.js gérer la 404
    if (!isKnownRoute) return;

    // Si pas connecté → redirection login
    if (!user) {
      router.replace("/pages/auth/login");
    }
  }, [isClient, checkedRoute, isKnownRoute, user, pathname, router]);

  // 🕓 Si la route n'est pas encore vérifiée
  if (!isClient || !checkedRoute) {
    return null;
  }

  // 🚫 Si route inconnue → laisser Next.js afficher not-found.tsx
  if (!isKnownRoute) {
    return <>{children}</>; // permet à Next.js d’afficher la page 404
  }

  // 🕓 Si utilisateur non connecté sur route protégée
  if (!user && !PUBLIC_ROUTES.includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        Chargement...
      </div>
    );
  }

  return <>{children}</>;
}
