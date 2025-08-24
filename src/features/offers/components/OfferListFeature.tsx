// src/features/offers/components/OfferListFeature.tsx
import { offersNormalized } from "@/lib/offers";
import type { NormalizedOffer } from "@/lib/offers";

type LicenseSelectValue = "all" | "MGA" | "UKGC" | "Curaçao";

export default function OfferListFeature({
  license = "all",
  q = "",
}: { license?: LicenseSelectValue; q?: string }) {
  const qn = q.trim().toLowerCase();

  const list: NormalizedOffer[] = offersNormalized
    .filter(o => license === "all" ? true : o.license === license)
    .filter(o => qn
      ? [o.name, o.license, o.payout, ...(o.methods ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(qn)
      : true
    );

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((o) => (
        <li key={o.slug} className="neon-card p-4">
          <div className="font-semibold">{o.name}</div>
          <div className="text-sm text-[var(--text-dim)]">
            {o.license} • {o.payout}{o.payoutHours ? ` (~${o.payoutHours}h)` : ""}
          </div>
        </li>
      ))}
      {!list.length && (
        <li className="text-sm text-[var(--text-dim)]">Ничего не найдено</li>
      )}
    </ul>
  );
}