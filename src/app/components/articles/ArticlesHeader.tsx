// src/app/components/articles/ArticlesHeader.tsx
import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import ExportButton from '../ExportButton';
import type { Article } from '@/app/lib/types';

interface ArticlesHeaderProps {
    count: number;
    articles?: Article[]; // ✅ Ajout pour l'export
}

export function ArticlesHeader({ count, articles = [] }: ArticlesHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Articles
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-14">
                    {count === 0 ? 'Aucun article' : `${count} article${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}`}
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Bouton d'export - visible uniquement s'il y a des articles */}
                {articles.length > 0 && (
                    <ExportButton
                        articles={articles}
                        variant="secondary"
                        size="md"
                        label="Exporter"
                    />
                )}

                {/* Bouton Nouvel article */}
                <Link
                    href="/pages/articles/create"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                    <Plus className="w-5 h-5" />
                    Nouvel article
                </Link>
            </div>
        </div>
    );
}