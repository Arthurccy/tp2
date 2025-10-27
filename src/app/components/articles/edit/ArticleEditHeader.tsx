'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ArticleEditHeader({ articleId }: { articleId: string }) {
    return (
        <Link
            href={`/pages/articles/${articleId}`}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
            <ArrowLeft className="w-4 h-4" />
            Retour à l’article
        </Link>
    );
}
