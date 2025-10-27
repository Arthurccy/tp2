"use client";

import { useState, useEffect } from "react";
import { Settings, X, Mail, Shield, Tag } from "lucide-react";
import UserEdit from "@/app/components/users/UserEdit";
import { useAuthStore } from "@/app/store/authStore";
import { useUserStore } from "@/app/store/userStore";
import type { User } from "@/app/lib/types";

interface UserCardProps {
  userId?: string; // ✅ optionnel — permet d’afficher un user précis
}

export default function UserCard({ userId }: UserCardProps) {
  const authUser = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);
  const { users, updateUser } = useUserStore();

  const [mounted, setMounted] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // ✅ si on a un userId en prop, on affiche ce user-là
  // sinon, on affiche le user connecté (authUser)
  const currentUser = userId
    ? users.find((u) => u.id === userId)
    : authUser
    ? users.find((u) => u.id === authUser.id)
    : null;

  if (!currentUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 dark:text-gray-400">
          Utilisateur introuvable.
        </p>
      </div>
    );

  // ✅ seul le propriétaire ou un admin peut modifier
  const canEdit =
    authUser && (authUser.id === currentUser.id || authUser.role === "admin");

  const handleSave = (updatedUser: User) => {
    // 1️⃣ Met à jour le user dans le userStore
    updateUser(currentUser.id, updatedUser);

    // 2️⃣ Si c’est le user connecté, met à jour aussi dans le authStore
    if (authUser && authUser.id === currentUser.id) {
      setAuthUser({ ...authUser, ...updatedUser });
    }

    setShowEdit(false);
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-md p-8 transition-all duration-500 hover:shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="relative">
            <img
              src={currentUser.pp}
              alt={currentUser.username}
              className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-700 shadow-md object-cover"
            />
            {currentUser.role === "admin" && (
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-purple-600 dark:bg-purple-500 rounded-full border-2 border-white dark:border-gray-800">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {canEdit && (
            <button
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowEdit(true)}
              aria-label="Modifier le profil"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>

        {/* Infos user */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentUser.username}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {currentUser.role === "admin" ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold">
                <Shield className="w-3 h-3" />
                Administrateur
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                Utilisateur
              </span>
            )}
          </p>
        </div>

        {/* Autres infos */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span className="truncate">{currentUser.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <span className="truncate">{currentUser.sujet || "Aucun sujet"}</span>
          </div>
        </div>
      </div>

      {/* Modal d’édition */}
      {showEdit && canEdit && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setShowEdit(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-6 animate-fadeInScale">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Modifier le profil
                </h3>
                <button
                  onClick={() => setShowEdit(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <UserEdit
                user={currentUser}
                onClose={() => setShowEdit(false)}
                onSave={handleSave}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
