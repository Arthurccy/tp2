'use client';

import { ArticleForm } from '../ArticleForm';
import { CheckCircle } from 'lucide-react';
import { ArticleEditHeader } from './ArticleEditHeader';
import { ArticleEditSuccessToast } from './ArticleEditSuccessToast';
import type { Article } from '@/app/lib/types';

interface Props {
    article: Article;
    onSubmit: (values: { title: string; content: string }) => void;
    success: boolean;
}

export function ArticleEditFormWrapper({ article, onSubmit, success }: Props) {
    return (
        <div className="max-w-3xl mx-auto">
            <ArticleEditHeader articleId={article.id} />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    ✏️ Modifier l’article
                </h1>

                <ArticleForm
                    initial={{ title: article.title, content: article.content }}
                    onSubmit={onSubmit}
                    submitLabel="Mettre à jour l’article"
                    loadingLabel="Enregistrement..."
                />
            </div>

            {success && <ArticleEditSuccessToast />}
        </div>
    );
}
