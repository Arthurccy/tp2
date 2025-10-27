// src/app/store/articleStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Article } from "@/app/lib/types";
import { mockArticles } from "@/app/lib/mockData";

type ArticleState = {
    articles: Article[];
    add: (a: Omit<Article, "id" | "createdAt">) => void;
    update: (id: string, patch: Partial<Article>) => void;
    remove: (id: string) => void;
    reset: () => void;
};

export const useArticleStore = create<ArticleState>()(
    persist(
        (set, get) => ({
            articles: mockArticles,
            add: (a) =>
                set((s) => ({
                    articles: [
                        ...s.articles,
                        {
                            id: crypto.randomUUID(),
                            createdAt: new Date().toISOString(),
                            ...a,
                        },
                    ],
                })),
            update: (id, patch) =>
                set((s) => ({
                    articles: s.articles.map((x) => (x.id === id ? { ...x, ...patch } : x)),
                })),
            remove: (id) =>
                set((s) => ({ articles: s.articles.filter((x) => x.id !== id) })),
            reset: () => set({ articles: mockArticles }),
        }),
        { name: "articles", storage: createJSONStorage(() => localStorage) }
    )
);
