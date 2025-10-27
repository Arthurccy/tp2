// src/app/components/articles/detail/useArticleDetail.ts
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useArticleStore } from '@/app/store/articleStore';
import { mockUsers } from '@/app/lib/mockData';

export function useArticleDetail() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const article = useArticleStore(s => s.articles.find(a => String(a.id) === String(id)));
    const author = article ? mockUsers.find(u => u.id === article.authorId) : undefined;

    const wordCount = article ? article.content.trim().split(/\s+/).filter(Boolean).length : 0;
    const readingTime = Math.ceil(wordCount / 200);

    return { id, router, article, author, wordCount, readingTime };
}
