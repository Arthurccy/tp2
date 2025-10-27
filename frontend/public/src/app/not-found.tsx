"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-6 py-12 transition-colors duration-300">
      <div className="relative bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center animate-fadeInScale">
        {/* Icône d’alerte stylisée */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/20 rounded-full w-24 h-24 flex items-center justify-center shadow-inner">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400 animate-bounce" />
          </div>
        </div>

        {/* Texte principal */}
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Oups... Page introuvable
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          La page que vous cherchez n’existe pas ou a été déplacée.  
          Essayez de revenir en arrière ou de retourner à l’accueil.
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md transition-all"
          >
            <Home className="w-5 h-5" />
            Accueil
          </Link>
        </div>
      </div>

      {/* Fond décoratif subtil */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
}
