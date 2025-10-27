// src/app/lib/exportUtils.ts
import type { Article } from './types';

export type ExportFormat = 'json' | 'csv' | 'txt';

/**
 * Convertit un ou plusieurs articles en JSON
 */
export function toJSON(articles: Article | Article[]): string {
    return JSON.stringify(articles, null, 2);
}

export const exportOne = (a: Article, f: ExportFormat) =>
    exportArticles(a, f, 'single');

/**
 * Convertit des articles en CSV
 */
export function toCSV(articles: Article[]): string {
    if (articles.length === 0) return '';

    // Headers
    const headers = ['ID', 'Titre', 'Contenu', 'Auteur ID', 'Date de création'];

    // Escape CSV field (handle quotes and commas)
    const escapeCSV = (value: string): string => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    };

    // Rows
    const rows = articles.map(article => [
        escapeCSV(article.id),
        escapeCSV(article.title),
        escapeCSV(article.content),
        escapeCSV(article.authorId),
        escapeCSV(new Date(article.createdAt).toLocaleString('fr-FR'))
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
}

/**
 * Convertit un ou plusieurs articles en TXT
 */
export function toTXT(articles: Article | Article[]): string {
    const list = Array.isArray(articles) ? articles : [articles];

    return list.map((article, index) => {
        const separator = '='.repeat(80);
        const date = new Date(article.createdAt).toLocaleString('fr-FR', {
            dateStyle: 'full',
            timeStyle: 'short'
        });

        return `${separator}
${index > 0 ? '\n' : ''}ARTICLE #${article.id}
${separator}

Titre : ${article.title}
Auteur ID : ${article.authorId}
Date : ${date}

${separator}
CONTENU
${separator}

${article.content}

${separator}`;
    }).join('\n\n');
}

/**
 * Génère un nom de fichier pour l'export
 */
export function generateFilename(
    format: ExportFormat,
    type: 'single' | 'multiple',
    articleId?: string
): string {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if (type === 'single' && articleId) {
        return `article_${articleId}.${format}`;
    }

    return `articles_export_${timestamp}.${format}`;
}

/**
 * Télécharge un fichier côté client
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export principal - gère tous les formats
 */
export function exportArticles(
    articles: Article | Article[],
    format: ExportFormat,
    type: 'single' | 'multiple' = 'multiple'
) {
    const articleId = !Array.isArray(articles) ? articles.id : undefined;
    const filename = generateFilename(format, type, articleId);

    let content: string;
    let mimeType: string;

    switch (format) {
        case 'json':
            content = toJSON(articles);
            mimeType = 'application/json';
            break;

        case 'csv':
            const list = Array.isArray(articles) ? articles : [articles];
            content = toCSV(list);
            mimeType = 'text/csv';
            break;

        case 'txt':
            content = toTXT(articles);
            mimeType = 'text/plain';
            break;

        default:
            throw new Error(`Format non supporté : ${format}`);
    }

    downloadFile(content, filename, mimeType);
}