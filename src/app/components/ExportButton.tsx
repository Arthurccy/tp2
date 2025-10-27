// src/app/components/ExportButton.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileJson, FileText, Table } from "lucide-react";
import { exportArticles, ExportFormat } from "../lib/exportUtils";
import type { Article } from "../lib/types";

interface ExportButtonProps {
  articles: Article | Article[];
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function ExportButton({
  articles,
  variant = "secondary",
  size = "md",
  label = "Exporter",
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = (format: ExportFormat) => {
    const type = Array.isArray(articles) ? "multiple" : "single";
    exportArticles(articles, format, type);
    setIsOpen(false);
  };

  // Styles variants
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
    secondary:
      "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600",
    ghost:
      "bg-transparent hover:bg-white hover:text-black dark:hover:bg-gray-800 text-white dark:text-gray-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const exportOptions = [
    {
      format: "json" as ExportFormat,
      label: "JSON",
      description: "Format structuré",
      icon: FileJson,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      format: "csv" as ExportFormat,
      label: "CSV",
      description: "Tableau Excel",
      icon: Table,
      color: "text-green-600 dark:text-green-400",
    },
    {
      format: "txt" as ExportFormat,
      label: "TXT",
      description: "Texte brut",
      icon: FileText,
      color: "text-gray-600 dark:text-gray-400",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center justify-center gap-2 
          ${variantClasses[variant]} 
          ${sizeClasses[size]}
          rounded-xl font-semibold transition-all duration-200
        `}
      >
        <Download className={iconSizes[size]} />
        {label}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Format d&apos;export
            </div>

            {exportOptions.map(
              ({ format, label, description, icon: Icon, color }) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                >
                  <div
                    className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600 transition-colors`}
                  >
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {description}
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
