// src/pages/Compare.tsx
import { useEffect, useMemo, useState } from "react";

import CompareTable, { type SortKey } from "@/components/CompareTable";
import CompareFilters, {
  type LicenseFilter,
  type MethodFilter,
} from "@/components/CompareFilters";

import { casinos } from "@/data/casinos";
import type { Offer } from "@/types/offer";
import { parseHash, writeHash } from "@/lib/hashState";

type ViewState = {
  license: LicenseFilter | "all";
  method: MethodFilter | "all";
  sort: SortKey;
  dir: "asc" | "desc";
};

export default function ComparePage() {
  // читаем начальное состояние из hash
  const [state, setState] = useState<ViewState>(() => {
    const h = parseHash();
    return {
      license: (h.license ?? "all") as ViewState["license"],
      method: (h.method ?? "all") as ViewState["method"],
      sort: (h.sort ?? "rating") as SortKey,
      dir: (h.dir ?? "desc") as "asc" | "desc",
    };
  });

  // следим за изменениями hash (если пользователь меняет урл)
  useEffect(() => {
    const onHashChange = () => {
      const h = parseHash();
      setState((s) => ({
        license: (h.license ?? s.license) as ViewState["license"],
        method: (h.method ?? s.method) as ViewState["method"],
        sort: (h.sort ?? s.sort) as SortKey,
        dir: (h.dir ?? s.dir) as "asc" | "desc",
      }));
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // фильтрация
  const filtered = useMemo(() => {
    let arr: Offer[] = casinos.slice();

    if (state.license !== "all") {
      arr = arr.filter((o) => o.license === state.license);
    }
    if (state.method !== "all") {
      arr = arr.filter((o) => (o.methods ?? []).includes(state.method));
    }
    return arr;
  }, [state.license, state.method]);

  // смена сортировки из таблицы — пишем в hash и локально
  const onSortChange = (sort: SortKey, dir: "asc" | "desc") => {
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

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <aside className="md:col-span-1">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <CompareFilters
              total={casinos.length}
              filteredCount={filtered.length}
              onChange={({ license, method }: { license: LicenseFilter; method: MethodFilter }) => {
                writeHash({ license, method });
                setState((s) => ({ ...s, license, method }));
              }}
            />
          </div>
        </aside>

        <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
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