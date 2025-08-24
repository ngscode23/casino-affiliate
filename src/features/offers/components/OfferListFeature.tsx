import { useMemo } from "react";
import type { NormalizedOffer } from "@/lib/offers";
import { offersNormalized } from "@/lib/offers";
import OfferCard from "@/components/offers/OfferCard";

export type LicenseSelectValue = "all" | "MGA" | "UKGC" | "Curaçao";
export type OffersFilterState = { license: LicenseSelectValue; q: string };

export default function OfferListFeature({ filters }: { filters: OffersFilterState }) {
  const list: NormalizedOffer[] = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return offersNormalized.filter((o) => {
      if (filters.license !== "all" && o.license !== filters.license) return false;
      if (!q) return true;
      const hay = [o.name, o.license, ...o.methods].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [filters]);

  if (!list.length) {
    return <div className="text-[var(--text-dim)]">Ничего не найдено.</div>;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((offer, i) => (
        <OfferCard key={offer.slug} offer={offer} index={i} />
      ))}
    </ul>
  );
}