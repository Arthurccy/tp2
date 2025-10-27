// src/app/components/articles/ArticleForm.tsx
"use client";

import { useState } from "react";
import { FileText, Type, AlignLeft, Save, Loader2 } from "lucide-react";

export type ArticleFormValues = { title: string; content: string };

export function ArticleForm({
                                initial = { title: "", content: "" },
                                loading = false,
                                submitLabel = "Publier l'article",
                                loadingLabel = "Création en cours...",
                                onSubmit,
                            }: {
    initial?: ArticleFormValues;
    loading?: boolean;
    submitLabel?: string;
    loadingLabel?: string;
    onSubmit: (values: ArticleFormValues) => Promise<void> | void;
}) {
    const [title, setTitle] = useState(initial.title);
    const [content, setContent] = useState(initial.content);
    const disabled = loading || !title.trim() || !content.trim();

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(wordCount / 200); // ~200 mots/minute

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (disabled) return;
                await onSubmit({ title: title.trim(), content: content.trim() });
            }}
            className="space-y-6"
        >
            {/* Titre */}
            <div>
                <label
                    htmlFor="title"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
                >
                    <Type className="w-4 h-4" />
                    Titre de l&apos;article
                    <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Les bases de React pour débutants"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                        maxLength={100}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
                        {title.length}/100
                    </div>
                </div>
            </div>

            {/* Contenu */}
            <div>
                <label
                    htmlFor="content"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
                >
                    <AlignLeft className="w-4 h-4" />
                    Contenu
                    <span className="text-red-500">*</span>
                </label>
                <div className="relative">
          <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez votre article ici... Partagez vos idées, expériences et connaissances avec la communauté."
              rows={16}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
          />
                </div>

                {/* Stats du contenu */}
                <div className="flex items-center justify-between mt-3 text-sm">
                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <span>{content.length} caractères</span>
                        <span>•</span>
                        <span>{wordCount} mots</span>
                        {wordCount > 0 && (
                            <>
                                <span>•</span>
                                <span>~{readingTime} min de lecture</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview card */}
            {(title.trim() || content.trim()) && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Aperçu de votre article
                            </p>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                {title.trim() || "Sans titre"}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {content.trim() || "Aucun contenu"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={disabled}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {loadingLabel}
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            {submitLabel}
                        </>
                    )}
                </button>
            </div>

            {/* Info obligatoire */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                <span className="text-red-500">*</span> Champs obligatoires
            </p>
        </form>
    );
}