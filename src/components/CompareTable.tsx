// src/components/CompareTable.tsx
import { useMemo } from "react";
import type { Offer } from "../data/schema";
import { track } from "../lib/analytics";

type Props = {
  offers: Offer[];
  sortKey: "rating" | "payoutHours";
  sortDir: "asc" | "desc";
  onSortChange: (key: "rating" | "payoutHours", dir: "asc" | "desc") => void;
};

function toAriaSort(
  active: boolean,
  dir: "asc" | "desc"
): "none" | "ascending" | "descending" | "other" {
  if (!active) return "none";
  return dir === "asc" ? "ascending" : "descending";
}

export default function CompareTable({ offers, sortKey, sortDir, onSortChange }: Props) {
  const sorted = useMemo(() => {
    const arr = offers.slice();
    const dirMul = sortDir === "asc" ? 1 : -1;

    arr.sort((a, b) => {
      const va = (a as any)[sortKey] ?? Infinity; // undefined в конец
      const vb = (b as any)[sortKey] ?? Infinity;
      if (va === vb) return 0;
      return va > vb ? dirMul : -dirMul;
    });

    return arr;
  }, [offers, sortKey, sortDir]);

  const toggleSort = (key: "rating" | "payoutHours") => {
    const nextDir = sortKey === key ? (sortDir === "asc" ? "desc" : "asc") : "desc";
    onSortChange(key, nextDir);
    track("compare_sort", { key, dir: nextDir });
  };

  return (
    <div className="overflow-x-auto rounded-2xl shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-900 text-white">
          <tr className="uppercase text-xs tracking-wider">
            <th scope="col" className="text-left p-3">Оффер</th>

            <th
              scope="col"
              className="text-left p-3"
              aria-sort={toAriaSort(sortKey === "rating", sortDir)}
              title="Сортировать по рейтингу"
            >
              <button
                type="button"
                className="cursor-pointer select-none"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSort("rating");
                }}
              >
                Рейтинг {sortKey === "rating" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>
            </th>

            <th
              scope="col"
              className="text-left p-3"
              aria-sort={toAriaSort(sortKey === "payoutHours", sortDir)}
              title="Сортировать по среднему времени выплаты (ч)"
            >
              <button
                type="button"
                className="cursor-pointer select-none"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSort("payoutHours");
                }}
              >
                Выплаты (ч) {sortKey === "payoutHours" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </button>
            </th>

            <th scope="col" className="text-left p-3">Методы</th>
            <th scope="col" className="text-left p-3">Лицензия</th>
            <th scope="col" className="text-left p-3">Действия</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((o) => (
            <tr key={o.slug ?? o.name} className="border-t">
              <td className="p-3">{o.name}</td>
              <td className="p-3">{o.rating?.toFixed(1)}</td>
              <td className="p-3">{o.payoutHours ?? "—"}</td>
              <td className="p-3">{o.methods?.join(", ")}</td>
              <td className="p-3">{o.license}</td>
              <td className="p-3">
                <a
                  href={o.link ?? `/go/${o.slug}`}
                  className="inline-block rounded-xl px-3 py-2 border hover:bg-gray-50"
                >
                  Перейти
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}