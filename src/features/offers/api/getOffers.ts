// src/features/offers/api/getOffers.ts
import { supabase } from "@/lib/supabase";
import { offersNormalized } from "@/lib/offers";
import type { OfferDTO } from "./types";

/** Строка -> нормализованный enum лицензии для DTO */
function normalizeLicense(v?: string | null): OfferDTO["license"] {
  if (!v) return "Other";
  // убираем диакритику и приводим к нижнему регистру
  const s = v.normalize("NFKD").replace(/\u0301/g, "").toLowerCase();
  if (s === "mga") return "MGA";
  if (s === "ukgc") return "UKGC";
  if (s === "curacao" || s === "curaçao" || /cura[ck]ao/.test(s)) return "Curaçao";
  return "Other";
}

/** Тип строки из БД Supabase (offers) */
type DBOfferRow = {
  slug: string;
  name: string;
  rating: number | null;
  license: string | null;
  payout: string | null;
  payout_hours: number | null;
  methods: string[] | null;
  link: string | null;
  enabled: boolean | null;
  position: number | null;
};

/** Приведение строки БД к OfferDTO */
function rowToDTO(r: DBOfferRow): OfferDTO {
  return {
    id: r.slug,
    name: r.name,
    license: normalizeLicense(r.license),
    rating: Number(r.rating ?? 0),
    payout: r.payout ?? "",
    payoutHours: r.payout_hours ?? undefined,
    methods: Array.isArray(r.methods) ? r.methods : [],
    link: r.link ?? null,
  };
}

/** Приведение локального оффера из offersNormalized к OfferDTO */
function localToDTO(o: {
  slug: string;
  name: string;
  license?: string;
  rating?: number;
  payout?: string;
  payoutHours?: number;
  methods?: string[];
  link?: string | null;
}): OfferDTO {
  return {
    id: o.slug,
    name: o.name,
    license: normalizeLicense(o.license),
    rating: Number(o.rating ?? 0),
    payout: o.payout ?? "",
    payoutHours: o.payoutHours ?? undefined,
    methods: Array.isArray(o.methods) ? o.methods : [],
    link: o.link ?? null,
  };
}

/**
 * Основной источник — Supabase (offers, enabled=true, сортировки).
 * При ошибке/пустом ответе — фолбэк на локальные данные.
 */
export async function getOffers(): Promise<OfferDTO[]> {
  try {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("enabled", true)
      .order("position", { ascending: true, nullsFirst: true })
      .order("name", { ascending: true });

    if (!error && Array.isArray(data) && data.length) {
      return (data as DBOfferRow[]).map(rowToDTO);
    }
  } catch {
    // игнорируем и используем фолбэк
  }

  // Фолбэк: локальные офферы
  return offersNormalized.map(localToDTO);
}

/** Поиск одного оффера по slug с тем же источником/фолбэком */
export async function getOfferBySlug(slug: string): Promise<OfferDTO | null> {
  const list = await getOffers();
  return list.find((o) => o.id === slug) ?? null;
}