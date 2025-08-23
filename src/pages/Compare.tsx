// src/pages/Compare.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import CompareFilters, {
  type LicenseFilter, // "all" | "MGA" | "UKGC" | "Curaçao"
  type MethodFilter   // "all" | ...
} from "@/components/CompareFilters";
import CompareTable, { type SortKey } from "@/components/CompareTable";
import MobileOfferCard from "@/components/MobileOfferCard";
import Seo from "@/components/Seo";

import { offersNormalized, type NormalizedOffer } from "@/lib/offers"; // slug гарантирован, methods: string[]

function normalizeStr(s: string) {
  return s.toLowerCase().normalize("NFKD");
}

export default function Compare() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") ?? "";

  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [license, setLicense] = useState<LicenseFilter>("all");
  const [method, setMethod] = useState<MethodFilter>("all");
  const [search, setSearch] = useState<string>(initialQ);

  // Обновляем URL-параметр ?q= при изменении строки поиска (без трекинга — он в дочернем фильтре)
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (search) next.set("q", search);
    else next.delete("q");
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Фильтрация по лицензии/методам/поиску
  const filtered: NormalizedOffer[] = useMemo(() => {
    let arr = [...offersNormalized];

    if (license !== "all") arr = arr.filter(o => o.license === license);
    if (method !== "all") arr = arr.filter(o => o.methods.includes(method));

    if (search.trim()) {
      const q = normalizeStr(search.trim());
      arr = arr.filter(o => {
        const hay = [o.name, o.license, ...o.methods].join(" ");
        return normalizeStr(hay).includes(q);
      });
    }
    return arr;
  }, [license, method, search]);

  return (
    <section className="neon-container space-y-6">
      <Seo
        title="Compare Casinos — Fast Payouts, Ratings"
        description="Сравните казино по рейтингу, лицензии, методам выплат и скорости вывода."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: filtered.map((o, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${location.origin}/offers/${encodeURIComponent(o.slug)}`,
            name: o.name
          }))
        }}
      />

      <div className="neon-card p-4">
        <CompareFilters
          total={offersNormalized.length}
          filteredCount={filtered.length}
          license={license}
          method={method}
          search={search}
          onChange={({ license: nextLicense, method: nextMethod }) => {
            if (nextLicense !== license) setLicense(nextLicense); // трекинг внутри LicenseSelect/компонента фильтра
            if (nextMethod !== method) setMethod(nextMethod);     // трекинг внутри компонента фильтра
          }}
          onSearchChange={setSearch} // трекинг поиска — внутри поля поиска компонента фильтра
        />
      </div>

      {/* Мобильные карточки */}
      <div className="grid gap-3 sm:gap-4 md:hidden">
        {filtered.map((o) => (
          <MobileOfferCard key={o.slug} offer={o} />
        ))}
      </div>

      {/* Десктоп таблица */}
      <div className="neon-card p-0 hidden md:block">
        <CompareTable
          offers={filtered}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={(k, d) => {
            if (k !== sortKey || d !== sortDir) {
              setSortKey(k);
              setSortDir(d);
              // Если хочешь трекать сортировку — делай это внутри CompareTable, а не здесь, чтобы не дублировать подход.
            }
          }}
        />
      </div>
    </section>
  );
}