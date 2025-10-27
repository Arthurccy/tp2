// src/app/components/comments/CommentList.tsx
"use client";

import { Trash2, MessageCircle } from "lucide-react";
import { useCommentStore } from "../../store/commentStore";
import { useUserStore } from "../../store/userStore";

interface CommentListProps {
  articleId: string;
}

export default function CommentList({ articleId }: CommentListProps) {
  const { getByArticle, remove } = useCommentStore();
  const { users, currentUserId } = useUserStore();

  const comments = getByArticle(articleId);
  const currentUser = users.find((u) => u.id === currentUserId);

  const handleDelete = (commentId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      remove(commentId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (comments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
          <MessageCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Aucun commentaire
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Soyez le premier à commenter cet article !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {comments.length} commentaire{comments.length > 1 ? "s" : ""}
      </h3>

      {comments.map((comment) => {
        const author = users.find((u) => u.id === comment.authorId);
        const canDelete =
          currentUser?.role === "admin" || comment.authorId === currentUserId;

        return (
          <div
            key={comment.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                {(author?.username ?? "I")[0].toUpperCase()}
              </div>

              {/* Contenu du commentaire */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {author?.username ?? "Inconnu"}
                    </span>
                    {author?.role === "admin" && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                        Admin
                      </span>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  {/* Bouton de suppression */}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Supprimer le commentaire"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
