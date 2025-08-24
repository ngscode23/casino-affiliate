// src/features/offers/components/OfferListFeature.tsx
import { useMemo } from "react";
import Card from "@/components/common/card";
import MobileOfferCard from "@/components/offers/MobileOfferCard";
import OfferCard from "@/components/offers/OfferCard";
import type { NormalizedOffer } from "@/types/offer";
import type { OffersFilterState } from "./OfferFiltersFeature";

export default function OfferListFeature({
  offers,
  filters,
}: {
  offers: NormalizedOffer[];
  filters: OffersFilterState;
}) {
  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return offers.filter((o) => {
      if (filters.license !== "all" && o.license !== filters.license) return false;
      if (q) {
        const hay = `${o.name} ${o.license} ${(o.methods ?? []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [offers, filters]);

  if (!offers.length) {
    return <Card className="p-6 text-[var(--text-dim)]">Пока нет офферов.</Card>;
  }
  if (!filtered.length) {
    return <Card className="p-6 text-[var(--text-dim)]">Ничего не найдено по текущим фильтрам.</Card>;
  }

  return (
    <>
      {/* Мобайл */}
      <div className="grid gap-3 sm:gap-4 md:hidden">
        {filtered.map((o) => (
          <MobileOfferCard key={o.slug} offer={o} />
        ))}
      </div>
      {/* Десктоп */}
      <ul className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((o, i) => (
          <OfferCard key={o.slug} offer={o} index={i} />
        ))}
      </ul>
    </>
  );
}