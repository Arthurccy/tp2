"use client";

import { useUserStore } from "@/app/store/userStore";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#10b981"]; // bleu, vert

export default function UsersByRolePie() {
  const users = useUserStore((s) => s.users);
  const admin = users.filter((u) => u.role === "admin").length;
  const standard = users.length - admin;

  const data = [
    { name: "Admins", value: admin },
    { name: "Users", value: standard },
  ];

  return (
    <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Répartition des rôles
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={85}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
