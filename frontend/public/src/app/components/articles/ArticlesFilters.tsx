'use client';
export type SortOrder = 'desc' | 'asc';

export function ArticlesFilters({
  query,
  onQuery,
  order,
  onOrder,
  mineOnly,
  onMineOnly,
}: {
  query: string;
  onQuery: (v: string) => void;
  order: 'asc' | 'desc';
  onOrder: (v: 'asc' | 'desc') => void;
  mineOnly: boolean;
  onMineOnly: (v: boolean) => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* 🔍 Barre de recherche */}
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Rechercher par titre…"
        className="
          w-full sm:w-2/3 px-4 py-2.5 rounded-lg border border-gray-300
          bg-white dark:bg-gray-100
          text-gray-900 placeholder-gray-400
          outline-none
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-300 ease-in-out
          focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)]
        "
      />

      {/* ⚙️ Filtres de tri */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 dark:text-gray-300">
          Tri date
        </label>

        <select
          value={order}
          onChange={(e) => onOrder(e.target.value as SortOrder)}
          className="
            px-3 py-2 rounded-lg border border-gray-300
            bg-white dark:bg-gray-100
            text-gray-900
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-300 ease-in-out
            focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)]
          "
        >
          <option value="desc">Décroissant (récent d’abord)</option>
          <option value="asc">Croissant (ancien d’abord)</option>
        </select>

        {/* ✅ Checkbox moderne & visible en dark mode */}
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={mineOnly}
            onChange={(e) => onMineOnly(e.target.checked)}
            className="
              appearance-none relative w-5 h-5 rounded-md border border-gray-400
              bg-white dark:bg-gray-800
              cursor-pointer
              transition-all duration-300 ease-in-out
              checked:bg-blue-600 checked:border-blue-600
              hover:border-blue-500
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              focus:ring-offset-white dark:focus:ring-offset-gray-900
            "
          />
          {/* ✅ Petit check visuel custom */}
          <span
            className={`
              absolute w-5 h-5 flex items-center justify-center text-white
              pointer-events-none transition-opacity duration-200
              ${mineOnly ? "opacity-100" : "opacity-0"}
            `}
          >
            ✓
          </span>

          <span className="group-hover:text-blue-600 transition-colors">
            Mes articles
          </span>
        </label>
      </div>
    </div>
  );
}
