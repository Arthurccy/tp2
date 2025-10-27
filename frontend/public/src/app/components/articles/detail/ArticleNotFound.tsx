// src/app/components/articles/detail/ArticleNotFound.tsx
'use client';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export function ArticleNotFound() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article introuvable</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Cet article n&apos;existe pas ou a été supprimé.</p>
                    <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl">
                        <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                </div>
            </div>
        </div>
    );
}
