'use client';
import { CheckCircle } from 'lucide-react';

export function ArticleEditSuccessToast() {
    return (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Article mis à jour avec succès ✅</span>
        </div>
    );
}
