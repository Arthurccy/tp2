// src/app/components/articles/detail/ArticleBody.tsx
export function ArticleBody({ content }:{ content:string }) {
    return (
        <div className="px-8 md:px-12 py-10">
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line text-lg">
                    {content}
                </div>
            </div>
        </div>
    );
}
