// src/pages/Compare.tsx
import { useMemo, useState } from "react";
import CompareFilters, { type LicenseFilter, type MethodFilter } from "@/components/CompareFilters";
import CompareTable, { type SortKey } from "@/components/CompareTable";
import MobileOfferCard from "@/components/MobileOfferCard";
import { offers as allOffers } from "@/data/offers";
import type { Offer } from "@/types/offer";

export default function Compare() {
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [license, setLicense] = useState<LicenseFilter>("all");
  const [method, setMethod] = useState<MethodFilter>("all");

  const filtered: Offer[] = useMemo(() => {
    let arr = [...allOffers];
    if (license !== "all") arr = arr.filter(o => o.license === license);
    if (method !== "all") arr = arr.filter(o => (o.methods ?? o.payments ?? []).includes(method));
    return arr;
  }, [license, method]);

  return (
    <section className="neon-container space-y-6">
      <div className="neon-card p-4">
   <CompareFilters
  total={allOffers.length}
  filteredCount={filtered.length}
  license={license}           // ← текущее из родителя
  method={method}             // ← текущее из родителя
  onChange={({ license, method }) => {
    setLicense(license);
    setMethod(method);
  }}
/>
      </div>

      {/* Мобильные карточки */}
      <div className="grid gap-3 sm:gap-4 md:hidden">
        {filtered.map(o => <MobileOfferCard key={o.slug ?? o.name} offer={o} />)}
      </div>

      {/* Десктоп таблица */}
      <div className="neon-card p-0 hidden md:block">
        <CompareTable
          offers={filtered}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={(k, d) => { setSortKey(k); setSortDir(d); }}
        />
      </div>
    </section>
  );
}