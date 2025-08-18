// src/pages/Compare.tsx
import { useEffect, useMemo, useState } from "react";
import CompareTable from "../components/CompareTable";
import CompareFilters from "../components/CompareFilters";
import { casinos } from "../data/casinos";
import type { Offer } from "../data/schema";
import { parseHash, writeHash } from "../lib/hashState";
import { type LicenseFilter, type MethodFilter } from "../lib/hashState";

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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Сравнение офферов</h1>


<CompareFilters
  total={casinos.length}
  filteredCount={filtered.length}
  onChange={({ license, method }: { license: LicenseFilter; method: MethodFilter }) => {
    setState((s) => ({ ...s, license, method }));
  }}
      />
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
  );
}