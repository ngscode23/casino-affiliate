import { useState } from "react";
import Button from "@/components/ui/button";
import Section from "@/components/ui/section";
import { useFavorites } from "@/lib/useFavorites";
import { casinos as allOffers } from "@/data/casinos";
import MobileOfferCard from "@/components/MobileOfferCard";
import CompareTable, { type SortKey } from "@/components/CompareTable";
import Card from "@/components/ui/card";

export default function FavoritesPage() {
  const { ids, clear } = useFavorites();
  const list = allOffers.filter(o => ids.includes(o.slug ?? o.name));

  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  return (
    <>
      <section className="neon-hero">
        <Section>
          <h1
            style={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(28px,4.5vw,46px)" }}
          >
            Избранное
          </h1>
          <p className="neon-subline mt-2">Ваши сохранённые офферы.</p>

          {list.length > 0 && (
            <div className="mt-4">
              <Button variant="secondary" onClick={clear}>Очистить избранное</Button>
            </div>
          )}
        </Section>
      </section>

      <Section>
        {list.length === 0 ? (
          <Card className="p-6 text-[var(--text-dim)]">Вы ещё ничего не добавили.</Card>
        ) : (
          <>
            {/* mobile cards */}
            <div className="grid gap-3 sm:gap-4 md:hidden">
              {list.map(o => (
                <MobileOfferCard
                  key={o.slug ?? o.name}
                  offer={o}
                  selected={false}
                  toggle={() => {}}
                />
              ))}
            </div>

            {/* desktop table */}
            <div className="hidden md:block">
              <CompareTable
                offers={list}
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