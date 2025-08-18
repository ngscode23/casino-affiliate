import { useMemo, useState } from "react";
import type { Offer } from "../data/casinos";
import { ArrowUp, ArrowDown } from "lucide-react";

type CompareTableProps = { items: Offer[] };
type SortKey = "rating" | "payoutHours";

export function CompareTable({ items }: CompareTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const indicator = (key: SortKey) =>
    sortKey === key
      ? sortOrder === "asc"
        ? <ArrowUp size={14} className="inline ml-1" />
        : <ArrowDown size={14} className="inline ml-1" />
      : null;

  // Берём числовое значение для сортировки. payoutHours: меньше = быстрее; undefined уходит в конец.
  const getVal = (o: Offer, key: SortKey): number => {
    if (key === "rating") return o.rating ?? 0;
    return o.payoutHours ?? Number.POSITIVE_INFINITY;
  };

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => {
      const aVal = getVal(a, sortKey);
      const bVal = getVal(b, sortKey);
      if (aVal === bVal) return 0;
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
    return arr;
  }, [items, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      // по умолчанию: рейтинг по убыванию, выплаты (часы) по возрастанию
      setSortOrder(key === "rating" ? "desc" : "asc");
    }
  };

  return (
    <table className="w-full border-collapse border border-slate-800">
      <thead>
        <tr>
          <th className="border border-slate-800 p-2 text-left">Казино</th>
          <th className="border border-slate-800 p-2 text-left">Лицензия</th>
          <th
            className="border border-slate-800 p-2 cursor-pointer hover:bg-slate-800 text-left select-none"
            onClick={() => handleSort("rating")}
            aria-sort={sortKey === "rating" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
          >
            Рейтинг {indicator("rating")}
          </th>
          <th
            className="border border-slate-800 p-2 cursor-pointer hover:bg-slate-800 text-left select-none"
            onClick={() => handleSort("payoutHours")}
            aria-sort={sortKey === "payoutHours" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
            title="Чем меньше часов — тем быстрее выплаты"
          >
            Выплаты (ч) {indicator("payoutHours")}
          </th>
          <th className="border border-slate-800 p-2 text-left">Методы оплаты</th>
          <th className="border border-slate-800 p-2 text-right">Действие</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((c) => {
          const url = c.link ?? (c.slug ? `/go/${c.slug}` : "#");
          return (
            <tr key={c.slug || c.name}>
              <td className="border border-slate-800 p-2">{c.name}</td>
              <td className="border border-slate-800 p-2">{c.license}</td>
              <td className="border border-slate-800 p-2">
                {typeof c.rating === "number" ? c.rating.toFixed(1) : "—"}
              </td>
              <td className="border border-slate-800 p-2">
                {c.payout}
                {c.payoutHours != null && ` (${c.payoutHours} ч)`}
              </td>
              <td className="border border-slate-800 p-2">
                {Array.isArray(c.methods) ? c.methods.join(", ") : "—"}
              </td>
              <td className="border border-slate-800 p-2 text-right">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer nofollow"
                  className="inline-flex items-center rounded-lg bg-sky-400 px-3 py-2 font-semibold text-slate-900 hover:brightness-95"
                >
                  Перейти
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}