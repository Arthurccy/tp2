"use client";

import StatsCards from "@/app/components/stats/StatsCards";
import UsersByRolePie from "@/app/components/stats/charts/UsersByRolePie";
import ArticlesByMonthBar from "@/app/components/stats/charts/ArticlesByMonthBar";
import TopAuthorsBarChart from "@/app/components/stats/charts/TopAuthorsBarChart";

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de bord — Statistiques
        </h1>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UsersByRolePie />
          <ArticlesByMonthBar />
        </div>

        <div className="grid grid-cols-1">
          <TopAuthorsBarChart />
        </div>
      </div>
    </div>
  );
}
