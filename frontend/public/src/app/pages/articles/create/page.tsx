// src/app/pages/articles/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useArticleStore } from '../../../store/articleStore';
import { BackLink } from '../../../components/ui/BackLink';
import { ArticleForm } from '../../../components/articles/ArticleForm';
import { useUserStore } from '../../../store/userStore';
import { PenLine, Info, Sparkles } from 'lucide-react';

export default function CreateArticlePage() {
    const router = useRouter();
    const add = useArticleStore((s) => s.add);
    const [loading, setLoading] = useState(false);
    const userId = useUserStore(s => s.currentUserId);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <BackLink href="/pages/articles">Retour aux articles</BackLink>

                {/* Card principale */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mt-6">
                    {/* Header avec gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <PenLine className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Créer un nouvel article
                                </h1>
                                <p className="text-blue-100 mt-1">
                                    Partagez vos connaissances avec la communauté
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Formulaire */}
                    <div className="p-8">
                        <ArticleForm
                            loading={loading}
                            onSubmit={async ({ title, content }) => {
                                setLoading(true);
                                await new Promise((r) => setTimeout(r, 800)); // simule API
                                add({ title, content, authorId: userId });
                                setLoading(false);
                                router.push('/pages/articles');
                            }}
                        />
                    </div>

                    {/* Info box */}
                    <div className="px-8 pb-8">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                                        À savoir
                                    </h3>
                                    <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                                        Votre article est sauvegardé localement et persiste après actualisation de la page. Il sera visible par tous les utilisateurs de la plateforme.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips section */}
                    <div className="px-8 pb-8">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
                            <div className="flex items-start gap-3 mb-3">
                                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                        Conseils pour un bon article
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                                            <span>Utilisez un titre clair et accrocheur</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                                            <span>Structurez votre contenu avec des paragraphes</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                                            <span>Visez au moins 200 mots pour un article complet</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}