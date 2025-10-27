// src/app/components/articles/detail/ArticleFooter.tsx
import Link from 'next/link';

export function ArticleFooter({ authorId, authorName='Inconnu' }:{
    authorId?: string; authorName?: string;
}) {
    const initial = (authorName ?? 'I')[0]?.toUpperCase?.() ?? 'I';
    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 px-8 md:px-12 py-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link href={`/pages/users/${authorId ?? ''}`} className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 p-2 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {initial}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{authorName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Auteur</p>
                    </div>
                </Link>
                <Link href="/pages/articles" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl">
                    Voir tous les articles
                </Link>
            </div>
        </div>
    );
}
