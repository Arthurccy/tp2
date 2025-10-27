// src/app/components/articles/EmptyArticles.tsx
import Link from 'next/link';
import { FileText, Plus, Sparkles } from 'lucide-react';

export function EmptyArticles() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors">
            {/* Icône centrale */}
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                        <FileText className="w-12 h-12 text-white" />
                    </div>
                </div>
            </div>

            {/* Titre */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Aucun article trouvé
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Commencez votre aventure d&apos;écriture en créant votre premier article. Partagez vos idées avec la communauté !
            </p>

            {/* Bouton d'action */}
            <Link
                href="/pages/articles/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-lg group"
            >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Créer mon premier article
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </Link>

            {/* Suggestions */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    💡 Idées pour commencer :
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
                        Tutoriel
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm font-medium">
                        Actualités
                    </span>
                    <span className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium">
                        Guide pratique
                    </span>
                    <span className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium">
                        Opinion
                    </span>
                </div>
            </div>
        </div>
    );
}