// src/pages/Offer.tsx
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Rating from "@/components/ui/rating";
import Button from "@/components/ui/button";

// Если у тебя данные в "@/data/offers", поменяй импорт ниже.
import { casinos as allOffers } from "@/data/casinos";
// import { offers as allOffers } from "@/data/offers";

import type { Offer } from "@/types/offer";

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function OfferPage() {
  const { slug } = useParams<{ slug: string }>();

  const offer: Offer | null = useMemo(() => {
    if (!slug) return null;
    const s = decodeURIComponent(slug);
    return (
      allOffers.find(
        (o) => (o.slug ?? slugify(o.name)) === s || slugify(o.name) === s
      ) ?? null
    );
  }, [slug]);

  if (!offer) {
    return (
      <Section>
        <Card className="p-6">
          <div className="text-lg font-semibold mb-2">Not found</div>
          <p className="text-[var(--text-dim)]">Мы не нашли такой оффер.</p>
          <div className="mt-4">
            <Button>
              <Link to="/compare">Back to compare</Link>
            </Button>
          </div>
        </Card>
      </Section>
    );
  }

  // Если в типе Offer нет payments — берём methods, иначе fallback на payments.
  const methods = (offer.methods ?? (offer as any).payments ?? []) as string[];

  return (
    <>
      <section className="neon-hero">
        <Section>
          <h1
            style={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(28px,4.5vw,46px)",
            }}
          >
            {offer.name}
          </h1>
          <p className="neon-subline mt-2">
            License: {offer.license ?? "—"} • Payout: {offer.payout}
            {offer.payoutHours ? ` (~${offer.payoutHours}h)` : ""}
          </p>
        </Section>
      </section>

      <Section className="space-y-6">
        <Card className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Левая колонка — инфо */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-dim)]">Rating</span>
                <Rating value={offer.rating ?? 0} />
              </div>

              <div>
                <div className="text-[var(--text-dim)] mb-1">Payout</div>
                <div>
                  {offer.payout}
                  {offer.payoutHours ? ` (~${offer.payoutHours}h)` : ""}
                </div>
              </div>

              <div>
                <div className="text-[var(--text-dim)] mb-1">Methods</div>
                <div className="flex flex-wrap gap-2">
                  {methods.length
                    ? methods.map((m, i) => (
                        <span key={`${m}-${i}`} className="neon-chip">
                          {m}
                        </span>
                      ))
                    : "—"}
                </div>
              </div>
            </div>

            {/* Правая колонка — действия */}
            <div className="space-y-3">
              <Button className="w-full">
                <a
                  href={offer.link ?? "#"}
                  className="inline-flex w-full items-center justify-center"
                  target={offer.link?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    offer.link?.startsWith("http")
                      ? "nofollow sponsored noopener"
                      : undefined
                  }
                >
                  Play now
                </a>
              </Button>

              {/* При необходимости можно оставить вторую кнопку/ссылку */}
              {/* <Button className="w-full">
                <Link to="/compare">Back to compare</Link>
              </Button> */}
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}