// src/pages/Favorites/index.tsx
import { useMemo, useCallback, useState } from "react";
import Section from "@/components/common/section";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Seo from "@/components/Seo";

import MobileOfferCard from "@/components/offers/MobileOfferCard";
import CompareTable, { type SortKey } from "@/components/compare/CompareTable";

import { offersNormalized } from "@/lib/offers";
import { useFavorites } from "@/lib/useFavorites";

export default function FavoritesPage() {
  const { items, isLoading, remove } = useFavorites(); // items: string[] (слаги)
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Мэпим избранные слаги в объекты офферов
  const favOffers = useMemo(
    () => offersNormalized.filter((o) => items.includes(o.slug)),
    [items]
  );

  // Очистка избранного
  const clearAll = useCallback(async () => {
    // по очереди удаляем; если подключён Supabase — удалится и на сервере
    for (const slug of items) {
      await remove(slug);
    }
  }, [items, remove]);

  return (
    <>
      <Seo
        title="Избранное — ваши сохранённые казино"
        description="Быстрый доступ к сохранённым офферам."
      />

      <section className="neon-hero">
        <Section>
          <h1
            style={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(28px,4.5vw,46px)",
            }}
          >
            Избранное
          </h1>
          <p className="neon-subline mt-2">
            Ваши сохранённые офферы.
          </p>

          {favOffers.length > 0 && (
            <div className="mt-4">
              <Button variant="secondary" onClick={clearAll}>
                Очистить избранное
              </Button>
            </div>
          )}
        </Section>
      </section>

      <Section className="space-y-6">
        {isLoading ? (
          <Card className="p-6">Загрузка…</Card>
        ) : favOffers.length === 0 ? (
          <Card className="p-6 text-[var(--text-dim)]">
            Вы ещё ничего не добавили.
          </Card>
        ) : (
          <>
            {/* Мобайл — карточки */}
            <div className="grid gap-3 sm:gap-4 md:hidden">
              {favOffers.map((o) => (
                <MobileOfferCard key={o.slug} offer={o} />
              ))}
            </div>

            {/* Десктоп — таблица */}
            <div className="hidden md:block">
              <CompareTable
                offers={favOffers}
                sortKey={sortKey}
                sortDir={sortDir}
                onSortChange={(k, d) => {
                  setSortKey(k);
                  setSortDir(d);
                }}
              />
            </div>
          </>
        )}
      </Section>
    </>
  );
}

// 
