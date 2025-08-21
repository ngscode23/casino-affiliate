// src/pages/Compare.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import CompareFilters, {
  type LicenseFilter,
  type MethodFilter,
} from "@/components/CompareFilters";
import CompareTable, { type SortKey } from "@/components/CompareTable";
import MobileOfferCard from "@/components/MobileOfferCard";

import { offers as allOffers } from "@/data/offers";
import type { Offer } from "@/types/offer";
import Seo from "@/components/Seo";

function normalize(s: string) {
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

  // обновляем URL, когда меняется строка поиска
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (search) next.set("q", search);
    else next.delete("q");
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filtered: Offer[] = useMemo(() => {
    let arr = [...allOffers];

    if (license !== "all") arr = arr.filter(o => o.license === license);
    if (method !== "all")
      arr = arr.filter(o => (o.methods ?? o.payments ?? []).includes(method));

    if (search.trim()) {
      const q = normalize(search.trim());
      arr = arr.filter(o => {
        const hay = [o.name, o.license, ...(o.methods ?? o.payments ?? [])]
          .join(" ")
          .toString();
        return normalize(hay).includes(q);
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
            url: `${location.origin}/offers/${encodeURIComponent(
              (o.slug ?? o.name.toLowerCase()).replace(/\s+/g, "-")
            )}`,
            name: o.name,
          })),
        }}
      />

      <div className="neon-card p-4">
        <CompareFilters
          total={allOffers.length}
          filteredCount={filtered.length}
          license={license}
          method={method}
          search={search}
          onChange={({ license, method }: { license: LicenseFilter; method: MethodFilter }) => {
            setLicense(license);
            setMethod(method);
          }}
          onSearchChange={setSearch}
        />
      </div>

      {/* Мобильные карточки */}
      <div className="grid gap-3 sm:gap-4 md:hidden">
        {filtered.map(o => (
          <MobileOfferCard
            key={o.slug ?? o.name}
            offer={o}
            // заглушка, чтобы не падало: заменишь на реальный toggle из контекста
            toggle={() => {}}
            selected={false}
          />
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