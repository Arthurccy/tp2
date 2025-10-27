// src/app/store/commentStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Comment } from "@/app/lib/types";

type CommentState = {
    comments: Comment[];
    add: (comment: Omit<Comment, "id" | "createdAt">) => void;
    remove: (id: string) => void;
    getByArticle: (articleId: string) => Comment[];
    reset: () => void;
};

export const useCommentStore = create<CommentState>()(
    persist(
        (set, get) => ({
            comments: [],

            add: (comment) =>
                set((state) => ({
                    comments: [
                        ...state.comments,
                        {
                            id: crypto.randomUUID(),
                            createdAt: new Date().toISOString(),
                            ...comment,
                        },
                    ],
                })),

            remove: (id) =>
                set((state) => ({
                    comments: state.comments.filter((c) => c.id !== id),
                })),

            getByArticle: (articleId) =>
                get()
                    .comments.filter((c) => c.articleId === articleId)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

            reset: () => set({ comments: [] }),
        }),
        { name: "comments", storage: createJSONStorage(() => localStorage) }
    )
);