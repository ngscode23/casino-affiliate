import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Rating from "@/components/ui/rating";
import Button from "@/components/ui/button";
import { FavControl } from "@/components/FavControl";
import { useCompare } from "@/ctx/CompareContext";
import FilterBar from "@/components/FilterBar";
import Seo from "@/components/Seo";
import { casinos } from "@/data/casinos";
import type { Offer } from "@/types/offer";

function slugify(name: string) { return name.toLowerCase().replace(/\s+/g, "-"); }

export default function OffersIndexPage() {
  const base = typeof window !== "undefined" ? window.location.origin : "https://example.com";
  const [q, setQ] = useState("");
  const { isSelected, toggle } = useCompare();

  const items: Offer[] = useMemo(() => {
    const list = casinos as Offer[];
    const filtered = q.trim()
      ? list.filter(o => (o.name + " " + (o.license ?? "")).toLowerCase().includes(q.toLowerCase()))
      : list;
    return filtered;
  }, [q]);

  const jsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Casino Offers",
      "mainEntity": items.slice(0, 10).map((o) => ({
        "@type": "Product",
        "name": o.name,
        "url": ${base}/offers/
      }))
    };
  }, [base, items]);

  return (
    <>
      <Seo title="Список казино — CasinoHub" description="Все проверенные казино: рейтинг, лицензии, скорость выплат." jsonLd={jsonLd} />
      <section className="neon-hero">
        <Section>
          <h1 className="font-extrabold tracking-tight" style={{fontSize: "clamp(28px,4.5vw,46px)"}}>
            Все казино и офферы
          </h1>
          <p className="neon-subline mt-2">Фильтруйте, добавляйте в сравнение и избранное.</p>
        </Section>
      </section>

      <Section className="space-y-6">
        <FilterBar query={q} onQuery={setQ} onClear={() => setQ("")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((o) => {
            const id = o.slug ?? o.name;
            const selected = isSelected(id);
            const to = /offers/;
            return (
              <Card key={id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{o.name}</div>
                    <div className="text-xs text-[var(--text-dim)]">{o.license ?? "—"}</div>
                  </div>
                  <Rating value={o.rating ?? 0} />
                </div>

                <div className="mt-3 text-sm">
                  Payout: {o.payout}{o.payoutHours ?  (~ч) : ""}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(o.methods ?? o.payments ?? []).map((m, i) => (
                    <span key={${m}-} className="neon-chip">{m}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button>
                    <Link to={to}>Подробнее</Link>
                  </Button>
                  <Button
                    variant={selected ? "secondary" : "soft"}
                    aria-pressed={selected}
                    onClick={() => toggle(o)}
                  >
                    {selected ? "Selected" : "Compare"}
                  </Button>
                  <FavControl id={id} />
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </>
  );
}
