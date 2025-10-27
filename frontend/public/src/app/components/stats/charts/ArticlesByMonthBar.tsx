"use client";

import { useArticleStore } from "@/app/store/articleStore";
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

// Regroupe les articles par mois sur N mois (labels YYYY-MM)
function buildMonthlySeries(isoDates: string[], monthsBack = 6) {
  const now = new Date();
  const buckets: { key: string; count: number }[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = d.toISOString().slice(0, 7); // YYYY-MM
    buckets.push({ key, count: 0 });
  }

  isoDates.forEach((iso) => {
    const key = iso.slice(0, 7);
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.count += 1;
  });

  // Recharts : { month: 'YYYY-MM', articles: number }
  return buckets.map((b) => ({ month: b.key, articles: b.count }));
}

export default function ArticlesByMonthBar() {
  const articles = useArticleStore((s) => s.articles);
  const { theme } = useTheme();
  const data = buildMonthlySeries(articles.map((a) => a.createdAt), 6);

  // 🎨 Couleurs adaptatives
  const barColor = theme === "dark" ? "#ffffff" : "#2563eb"; // blanc ou bleu
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"; // gris foncé ou clair
  const textColor = theme === "dark" ? "#d1d5db" : "#374151"; // gris clair ou foncé
  const tooltipBg = theme === "dark" ? "#1f2937" : "#ffffff"; // fond tooltip
  const tooltipColor = theme === "dark" ? "#f9fafb" : "#111827";

  return (
    <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Articles par mois (6 derniers)
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tick={{ fill: textColor }} />
            <YAxis allowDecimals={false} tick={{ fill: textColor }} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: "none",
                borderRadius: "0.5rem",
                color: tooltipColor,
              }}
            />
            <Bar dataKey="articles" fill={barColor} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
