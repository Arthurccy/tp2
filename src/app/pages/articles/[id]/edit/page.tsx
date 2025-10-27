'use client';

import { useArticleEdit } from '@/app/components/articles/edit/useArticleEdit';
import { ArticleEditFormWrapper } from '@/app/components/articles/edit/ArticleEditFormWrapper';

export default function EditArticlePage() {
    const { article, canEdit, success, handleSubmit } = useArticleEdit();

    if (!article)
        return <p className="text-center text-gray-500 mt-10">❌ Article introuvable.</p>;

    if (!canEdit)
        return (
            <p className="text-center text-gray-500 mt-10">
                ⛔ Vous n’êtes pas autorisé à modifier cet article.
            </p>
        );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
            <ArticleEditFormWrapper
                article={article}
                onSubmit={handleSubmit}
                success={success}
            />
        </div>
    );
}
