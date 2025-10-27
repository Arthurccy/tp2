import Link from "next/link";
import { Eye, Trash2, Calendar, User } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";

type Props = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
  onDelete: () => void;
};

export function ArticleCard({ id, title, content, createdAt, authorName, onDelete }: Props) {
  const { user: currentUser } = useAuthStore();

  // 🔑 L’auteur OU l’admin peut supprimer
  const canDelete =
    currentUser?.username === authorName || currentUser?.username === "admin";

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Titre */}
            <Link href={`/pages/articles/${id}`}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {title}
              </h2>
            </Link>

            {/* Contenu preview */}
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
              {content}
            </p>

            {/* Meta infos */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{authorName}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Link
              href={`/pages/articles/${id}`}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all font-medium"
              title="Voir l'article"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Voir</span>
            </Link>

            {canDelete && (
              <button
                onClick={onDelete}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium"
                title="Supprimer l'article"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Supprimer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Barre de progression au survol */}
      <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </article>
  );
}
