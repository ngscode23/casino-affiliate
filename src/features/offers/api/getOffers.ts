// src/features/offers/api/getOffers.ts
import { offersNormalized } from "@/lib/offers";
import type { OfferDTO } from "./types";

function normalizeLicense(v?: string): OfferDTO["license"] {
  if (!v) return "Other";
  const s = v.normalize("NFKD").replace(/\u0301/g, ""); // убрать диакритику
  if (/^mga$/i.test(s)) return "MGA";
  if (/^ukgc$/i.test(s)) return "UKGC";
  if (/^cura(c|ç|c)a[oó]?$/i.test(s) || /^curacao$/i.test(s)) return "Curaçao";
  if (/^other$/i.test(s)) return "Other";
  return "Other";
}

export async function getOffers(): Promise<OfferDTO[]> {
  return offersNormalized.map(o => ({
    id: o.slug,
    name: o.name,
    license: normalizeLicense(o.license),
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