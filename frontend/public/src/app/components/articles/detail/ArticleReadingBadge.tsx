// src/app/components/articles/detail/ArticleReadingBadge.tsx
import { BookOpen } from 'lucide-react';

export function ArticleReadingBadge({ readingTime, wordCount }:{
    readingTime:number; wordCount:number;
}) {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-8 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium">Temps de lecture estimé : {readingTime} minute{readingTime>1?'s':''}</span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span>{wordCount} mots</span>
            </div>
        </div>
    );
}
