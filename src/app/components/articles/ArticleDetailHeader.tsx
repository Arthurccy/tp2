// src/app/components/articles/ArticleDetailHeader.tsx
'use client';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import type { Article } from '@/app/lib/types';

export function ArticleDetailHeader({
                                        article, authorName, readingTime, right,
                                    }: {
    article: Article; authorName: string; readingTime: number; right?: React.ReactNode;
}) {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link href="/pages/articles" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Retour aux articles</span>
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
          <span className="inline-flex items-center gap-2">
            <Calendar className="w-4 h-4" />
              {new Date(article.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
          </span>
                    <span className="text-white/50">•</span>
                    <span className="inline-flex items-center gap-2">
            <User className="w-4 h-4" />
                        {authorName}
          </span>
                    <span className="text-white/50">•</span>
                    <span className="inline-flex items-center gap-2">
            <Clock className="w-4 h-4" />
                        {readingTime} min de lecture
          </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight flex-1">{article.title}</h1>
                    {right}
                </div>
            </div>
        </div>
    );
}
