// src/lib/rankScore.ts
import type { Offer } from "@/types/offer";
export function rankScore(o: Offer) {
  const r = o.rating ?? 0; // 0..5
  const speed = o.payoutHours != null ? Math.max(0, 72 - o.payoutHours) / 72 : 0.5; // 0..1
  const lic = /MGA|UKGC/i.test(o.license) ? 1 : /Cur|Cura|Curaçao/i.test(o.license) ? 0.6 : 0.4;
  // веса: рейтинг 60%, скорость 25%, лицензия 15%
  return r/5 * 0.6 + speed * 0.25 + lic * 0.15;
}


















