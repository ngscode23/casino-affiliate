// src/pages/Compare/index.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import CompareFilters, {
  type LicenseFilter,
  type MethodFilter,
} from "@/components/compare/CompareFilters";
import CompareTable, { type SortKey } from "@/components/compare/CompareTable";
import MobileOfferCard from "@/components/offers/MobileOfferCard";
import Seo from "@/components/Seo";

import { useOffers } from "@/features/offers/api/useOffers";
import type { NormalizedOffer } from "@/lib/offers";

function normalizeStr(s: string) {
  return s.toLowerCase().normalize("NFKD");
}

export default function Compare() {
  const { offers, isLoading, error } = useOffers();

  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") ?? "";

  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [license, setLicense] = useState<LicenseFilter>("all");
  const [method, setMethod] = useState<MethodFilter>("all");
  const [search, setSearch] = useState<string>(initialQ);

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (search) next.set("q", search);
    else next.delete("q");
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filtered: NormalizedOffer[] = useMemo(() => {
    let arr = [...offers];

    if (license !== "all") arr = arr.filter((o) => o.license === license);
    if (method !== "all") arr = arr.filter((o) => o.methods.includes(method));

    if (search.trim()) {
      const q = normalizeStr(search.trim());
     arr = arr.filter((o,) => {
  const hay = [o.name, o.license, ...o.methods].join(" ");
  return normalizeStr(hay).includes(q);
});
    }
    return arr;
  }, [offers, license, method, search]);

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
            name: o.name,
          })),
        }}
      />

      <div className="neon-card p-4">
        <CompareFilters
          total={offers.length}
          filteredCount={filtered.length}
          license={license}
          method={method}
          search={search}
          onChange={({ license: nextLicense, method: nextMethod }) => {
            if (nextLicense !== license) setLicense(nextLicense);
            if (nextMethod !== method) setMethod(nextMethod);
          }}
          onSearchChange={setSearch}
        />
      </div>

      {/* заглушки/ошибки */}
      {error && (
        <div className="neon-card p-3 text-red-400">
          Ошибка загрузки офферов: {error}
        </div>
      )}

      {/* Мобайл карточки */}
      <div className="grid gap-3 sm:gap-4 md:hidden">
        {(isLoading ? [] : filtered).map((o) => (
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
            setSortKey(k);
            setSortDir(d);
          }}
        />
      </div>
    </section>
  );
}


