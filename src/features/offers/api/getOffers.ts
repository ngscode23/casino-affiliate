// src/features/offers/api/getOffers.ts
import { offersNormalized } from "@/lib/offers";
import type { OfferDTO } from "./types";

const licenseMap = new Map<string, OfferDTO["license"]>([
  ["MGA", "MGA"],
  ["UKGC", "UKGC"],
  ["Curaçao", "Curaçao"],
  ["Curacao", "Curaçao"], // латинизм -> нормализуем
  ["Other", "Other"],
]);
function toLicense(v?: string): OfferDTO["license"] {
  return (v && licenseMap.get(v)) ?? "Other";
}

export async function getOffers(): Promise<OfferDTO[]> {
  return offersNormalized.map(o => ({
    id: o.slug,
    name: o.name,
    license: toLicense(o.license),
    rating: o.rating ?? 0,
    payout: o.payout ?? "",
    payoutHours: o.payoutHours ?? undefined,
    methods: o.methods ?? [],
    link: o.link ?? null,
  }));
}

export async function getOfferBySlug(slug: string): Promise<OfferDTO | null> {
  const list = await getOffers();
  return list.find(o => o.id === slug) ?? null;
}