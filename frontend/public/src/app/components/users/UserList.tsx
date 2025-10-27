"use client";

import { User } from "../../lib/types";
import { useRouter } from "next/navigation";
import { ArrowRight, Users as UsersIcon, Mail, Tag, Shield, User as UserIcon } from "lucide-react";

interface UsersListProps {
  users: User[];
}

export default function UsersList({ users }: UsersListProps) {
  const router = useRouter();

  const handleUserClick = (userId: string) => {
    router.push(`/pages/users/${userId}`);
  };

  // Statistiques
  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestion des utilisateurs
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-14">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} inscrit{users.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UsersIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Administrateurs</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <UserIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="space-y-4">
          {users.map((user) => (
            <article
              key={user.id}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-center gap-6 p-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    alt={user.username}
                    src={user.pp}
                    className="w-20 h-20 rounded-full border-4 border-gray-100 dark:border-gray-700 shadow-md object-cover"
                  />
                  {user.role === 'admin' && (
                    <div className="absolute -bottom-1 -right-1 p-1 bg-purple-600 dark:bg-purple-500 rounded-full border-2 border-white dark:border-gray-800">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {user.username}
                    </h3>
                    {user.role === 'admin' && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      <span className="truncate">{user.sujet}</span>
                    </div>
                  </div>
                </div>

                {/* Bouton d'action */}
                <button
                  onClick={() => handleUserClick(user.id)}
                  className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all group-hover:scale-110"
                  aria-label={`Voir la fiche de ${user.username}`}
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Barre de progression au survol */}
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {users.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <UsersIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Aucun utilisateur
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Il n&apos;y a pas encore d&apos;utilisateurs inscrits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}