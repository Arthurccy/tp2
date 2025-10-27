// src/app/components/comments/CommentForm.tsx
'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useCommentStore } from '../../store/commentStore';
import { useUserStore } from '../../store/userStore';

interface CommentFormProps {
    articleId: string;
}

export default function CommentForm({ articleId }: CommentFormProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { add } = useCommentStore();
    const { currentUserId, users } = useUserStore();

    const currentUser = users.find(u => u.id === currentUserId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setIsSubmitting(true);

        // Simulation d'un délai d'envoi
        setTimeout(() => {
            add({
                articleId,
                authorId: currentUserId,
                content: content.trim(),
            });

            setContent('');
            setIsSubmitting(false);
        }, 300);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-start gap-4">
                {/* Avatar de l'utilisateur actuel */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                    {(currentUser?.username ?? 'U')[0].toUpperCase()}
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="flex-1">
                    <div className="mb-3">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ajoutez votre commentaire..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-shadow"
                disabled={isSubmitting}
            />
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Connecté en tant que <span className="font-semibold text-gray-700 dark:text-gray-300">{currentUser?.username}</span>
                        </p>

                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitting ? 'Envoi...' : 'Publier'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}