// src/pages/Compare.tsx
import { useEffect, useMemo, useState } from "react";
import CompareTable from "../components/CompareTable";
import CompareFilters from "../components/CompareFilters";
import { casinos } from "../data/casinos";
import type { Offer } from "../data/schema";
import { parseHash, writeHash, type LicenseFilter, type MethodFilter } from "../lib/hashState";

export default function ComparePage() {
  const [state, setState] = useState(parseHash());

  // Следим за изменениями hash (например, если пришли по ссылке)
  useEffect(() => {
    const onHashChange = () => setState(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const filtered = useMemo(() => {
    let arr: Offer[] = casinos.slice();

    if (state.license !== "all") {
      arr = arr.filter((o) => o.license === state.license);
    }

    if (state.method !== "all") {
      arr = arr.filter((o) => o.methods?.includes(state.method as any));
    }

    return arr;
  }, [state.license, state.method]);

  // Прокидываем сорт в таблицу через props, но храним в hash
  const onSortChange = (sort: "rating" | "payoutHours", dir: "asc" | "desc") => {
    writeHash({ sort, dir });
    setState((s) => ({ ...s, sort, dir }));
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-10">
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
        Сравнение казино
      </h1>
      <p className="mt-2 text-slate-600">
        Фильтруй по лицензии, методам и скорости выплат.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <div className="sticky top-20 rounded-2xl bg-white p-4 shadow-card border border-slate-200">
            <CompareFilters
              total={casinos.length}
              filteredCount={filtered.length}
              onChange={({ license, method }: { license: LicenseFilter; method: MethodFilter }) => {
                setState((s) => ({ ...s, license, method }));
              }}
            />
          </div>
        </aside>

        <div className="md:col-span-3 rounded-2xl bg-white p-4 shadow-card border border-slate-200">
          <CompareTable
            offers={filtered}
            sortKey={state.sort}
            sortDir={state.dir}
            onSortChange={onSortChange}
          />

          {filtered.length === 0 && (
            <p className="mt-6 text-gray-600">
              Ничего не найдено под текущие фильтры. Сними часть условий.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}