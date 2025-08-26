// src/features/offers/components/OfferListFeature.tsx
import type { NormalizedOffer } from "@/lib/offers";

// 👇 этот тип нужен странице Offers — экспортируем явно
export type OffersFilterState = {
  license: "all" | "MGA" | "UKGC" | "Curaçao";
  q: string;
};

type Props = {
  offers: NormalizedOffer[];
  filters: OffersFilterState;
  // 👇 сделаем опциональными, чтобы не ломать вызовы
  isLoading?: boolean;
  error?: string | null;
};

export default function OfferListFeature({
  offers,
  filters,
  isLoading,
  error,
}: Props) {
  if (isLoading) {
    return <div className="neon-card p-4">Загрузка…</div>;
  }
  if (error) {
    return <div className="neon-card p-4 text-red-400">Ошибка: {error}</div>;
  }

  const filtered = offers.filter((o) => {
    if (filters.license !== "all" && o.license !== filters.license) return false;

    if (filters.q.trim()) {
      const q = filters.q.toLowerCase();
      const hay = [o.name, o.license, ...o.methods].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    return <div className="neon-card p-4">Ничего не найдено.</div>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((o) => (
        <li key={o.slug} className="neon-card p-4 rounded-xl">
          <div className="font-semibold">{o.name}</div>
          <div className="text-sm text-[var(--text-dim)]">
            {o.license} • {o.rating.toFixed(1)}★
          </div>
        </li>
      ))}
    </ul>
  );
}


