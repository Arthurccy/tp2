"use client";

import { useUserStore } from "@/app/store/userStore";
import { useArticleStore } from "@/app/store/articleStore";
import { Users, FileText, Shield, CalendarClock } from "lucide-react";

export default function StatsCards() {
  const users = useUserStore((s) => s.users);
  const articles = useArticleStore((s) => s.articles);

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const totalArticles = articles.length;

  // YYYY-MM (évite les soucis d’hydratation)
  const thisMonthKey = new Date().toISOString().slice(0, 7);
  const articlesThisMonth = articles.filter(
    (a) => a.createdAt.slice(0, 7) === thisMonthKey
  ).length;

  const Card = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
  }) => (
    <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">{icon}</div>
      </div>
      <div className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card title="Utilisateurs" value={totalUsers} icon={<Users className="w-5 h-5" />} />
      <Card title="Admins" value={adminCount} icon={<Shield className="w-5 h-5" />} />
      <Card title="Articles" value={totalArticles} icon={<FileText className="w-5 h-5" />} />
      <Card
        title="Articles (mois en cours)"
        value={articlesThisMonth}
        icon={<CalendarClock className="w-5 h-5" />}
      />
    </div>
  );
}
