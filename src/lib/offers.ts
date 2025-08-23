// src/lib/offers.ts
import { slugify } from "./slug";
import { offers as rawOffers } from "@/data/offers";
import type { Offer as RawOffer } from "@/data/schema";

const normLicense = (s?: string) => {
  if (!s) return "Other";
  return /^curacao$/i.test(s) || /^cura(c|ç)ao$/i.test(s) ? "Curaçao" : s;
};

export type NormalizedOffer = Omit<RawOffer, "slug" | "methods" | "license"> & {
  slug: string;
  methods: string[];
  license: "MGA" | "UKGC" | "Curaçao" | "Other" | string;
};

export function normalizeOffer(o: RawOffer): NormalizedOffer {
  const methods = (o.methods ?? (o as any).payments ?? []) as string[];
  return {
    ...o,
    slug: o.slug ?? slugify(o.name),
    methods,
    license: normLicense(o.license)
  };
}

export const offersNormalized: NormalizedOffer[] = (rawOffers as RawOffer[])
  .filter(Boolean)
  .map(normalizeOffer);