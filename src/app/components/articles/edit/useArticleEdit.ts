'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useArticleStore } from '@/app/store/articleStore';
import { useUserStore } from '@/app/store/userStore';
import type { Article } from '@/app/lib/types';

export function useArticleEdit() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { articles, update } = useArticleStore();
    const { currentUserId, users } = useUserStore();
    const [success, setSuccess] = useState(false);

    const article = articles.find(a => a.id === id);
    const currentUser = users.find(u => u.id === currentUserId);

    const canEdit = article && (article.authorId === currentUserId || currentUser?.role === 'admin');

    function handleSubmit(values: Pick<Article, 'title' | 'content'>) {
        if (!article) return;
        update(article.id, values);
        setSuccess(true);
        setTimeout(() => router.push(`/pages/articles/${article.id}`), 1500);
    }

    return { article, canEdit, success, handleSubmit, setSuccess };
}
