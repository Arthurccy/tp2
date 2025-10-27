"use client";

import { useArticleStore } from "@/app/store/articleStore";
import { useUserStore } from "@/app/store/userStore";
import { useTheme } from "@/app/context/ThemeContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function TopAuthorsBarChart() {
  const { theme } = useTheme();
  const articles = useArticleStore((s) => s.articles);
  const users = useUserStore((s) => s.users);

  // Compte les articles par auteur
  const counts: Record<string, number> = {};
  articles.forEach((a) => {
    counts[a.authorId] = (counts[a.authorId] || 0) + 1;
  });

  // Associe l’auteur à son nom
  const data = Object.entries(counts)
    .map(([authorId, count]) => {
      const user = users.find((u) => u.id === authorId);
      return {
        author: user?.username || "Inconnu",
        articles: count,
      };
    })
    .sort((a, b) => b.articles - a.articles)
    .slice(0, 5); // Top 5 auteurs

  // 🎨 Couleurs adaptatives
  const barColor = theme === "dark" ? "#a78bfa" : "#6366f1"; // violet clair ou foncé
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
  const textColor = theme === "dark" ? "#d1d5db" : "#374151";
  const tooltipBg = theme === "dark" ? "#1f2937" : "#ffffff";
  const tooltipColor = theme === "dark" ? "#f9fafb" : "#111827";

  return (
    <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top 5 auteurs d’articles
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 20, bottom: 10, left: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: textColor }}
            />
            <YAxis
              dataKey="author"
              type="category"
              tick={{ fill: textColor }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: "none",
                borderRadius: "0.5rem",
                color: tooltipColor,
              }}
            />
            <Bar dataKey="articles" fill={barColor} radius={[6, 6, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
