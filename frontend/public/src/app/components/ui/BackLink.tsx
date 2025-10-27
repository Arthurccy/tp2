// src/app/components/ui/BackLink.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function BackLink({ 
    href, 
    children 
}: { 
    href: string; 
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-6"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{children}</span>
        </Link>
    );
}