// src/components/CompareTable.tsx
import { useMemo, useState } from "react";
import type { Offer } from "../data/casinos";

type SortKey = "name" | "rating" | "payoutHours";
type SortDir = "asc" | "desc";

type Props = { items: Offer[] };

export function CompareTable({ items }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [licenseFilter, setLicenseFilter] = useState<Offer["license"] | "ALL">("ALL");
  const [methodFilter, setMethodFilter] = useState<"ALL" | "Cards" | "SEPA" | "Crypto" | "Paypal" | "Skrill">("ALL");

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    return items.filter(o => o.enabled !== false)
      .filter(o => licenseFilter === "ALL" ? true : o.license === licenseFilter)
      .filter(o => methodFilter === "ALL" ? true : o.methods.includes(methodFilter as any));
  }, [items, licenseFilter, methodFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = sortKey === "name" ? a.name.toLowerCase()
              : sortKey === "rating" ? a.rating
              : (a.payoutHours ?? 99999);
      const vb = sortKey === "name" ? b.name.toLowerCase()
              : sortKey === "rating" ? b.rating
              : (b.payoutHours ?? 99999);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6">
      {/* Фильтры */}
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex items-center gap-2">
          <span className="text-sm text-slate-300 min-w-24">Лицензия</span>
          <select value={licenseFilter} onChange={e => setLicenseFilter(e.target.value as any)}
                  className="bg-slate-800/60 rounded-lg px-3 py-2 text-sm outline-none">
            <option value="ALL">Все</option>
            <option value="MGA">MGA</option>
            <option value="Curaçao">Curaçao</option>
            <option value="UKGC">UKGC</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm text-slate-300 min-w-24">Метод</span>
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value as any)}
                  className="bg-slate-800/60 rounded-lg px-3 py-2 text-sm outline-none">
            <option value="ALL">Все</option>
            <option value="Cards">Карты</option>
            <option value="SEPA">SEPA</option>
            <option value="Crypto">Crypto</option>
            <option value="Paypal">Paypal</option>
            <option value="Skrill">Skrill</option>
          </select>
        </label>
      </div>

      {/* Таблица */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-300">
              <Th onClick={() => toggleSort("name")} active={sortKey==="name"} dir={sortDir}>Название</Th>
              <Th onClick={() => toggleSort("rating")} active={sortKey==="rating"} dir={sortDir}>Рейтинг</Th>
              <Th onClick={() => toggleSort("payoutHours")} active={sortKey==="payoutHours"} dir={sortDir}>Выплаты</Th>
              <th className="px-3 py-2">Лицензия</th>
              <th className="px-3 py-2">Методы</th>
              <th className="px-3 py-2 text-right">Действие</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(o => (
              <tr key={o.name} className="border-t border-slate-800 hover:bg-slate-800/40">
                <td className="px-3 py-3 font-medium">{o.name}</td>
                <td className="px-3 py-3">{o.rating.toFixed(1)}</td>
                <td className="px-3 py-3">{o.payout}</td>
                <td className="px-3 py-3">{o.license}</td>
                <td className="px-3 py-3">{o.methods.join(", ")}</td>
                <td className="px-3 py-3 text-right">
                  <a href={o.link} target="_blank" rel="noreferrer nofollow"
                     className="inline-flex items-center rounded-lg bg-sky-400 px-3 py-2 font-semibold text-slate-900 hover:brightness-95">
                    Перейти
                  </a>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-400">Ничего не найдено по текущим фильтрам</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, onClick, active, dir }:{
  children: React.ReactNode; onClick: ()=>void; active: boolean; dir: SortDir;
}) {
  return (
    <th className="px-3 py-2 select-none">
      <button onClick={onClick} className="inline-flex items-center gap-1 text-slate-200 hover:underline">
        {children}
        <span className={`text-xs ${active ? "opacity-100" : "opacity-30"}`}>{dir === "asc" ? "▲" : "▼"}</span>
      </button>
    </th>
  );
}