// src/features/offers/components/OfferListFeature.tsx
import { useEffect, useState } from "react";
import { getOffers } from "../api/getOffers";
import OfferCard from "@/components/offers/OfferCard";
import type { NormalizedOffer } from "@/lib/offers";

export default function OfferListFeature() {
  const [items, setItems] = useState<NormalizedOffer[]>([]);

  useEffect(() => {
    getOffers().then(dto => {
      const mapped: NormalizedOffer[] = dto.map(o => ({
        slug: o.id,
        name: o.name,
        license: o.license,
        rating: o.rating ?? 0,
        payout: o.payout ?? "",
        payoutHours: o.payoutHours,
        methods: o.methods ?? [],
        link: o.link ?? undefined,
        enabled: true,
        position: undefined,
      }));
      setItems(mapped);
    });
  }, []);

  if (!items.length) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((o, i) => (
        <OfferCard key={o.slug} offer={o} index={i} />
      ))}
    </ul>
  );
}