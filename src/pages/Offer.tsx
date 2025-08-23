// src/pages/Offer.tsx
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Rating from "@/components/ui/rating";
import Seo from "@/components/Seo";
import AffiliateLink from "@/components/AffiliateLink";
import { FavoriteButton } from "@/components/FavoriteButton";

import { offersNormalized, type NormalizedOffer } from "@/lib/offers";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

export default function OfferPage() {
  const { slug } = useParams<{ slug: string }>();

  const offer: NormalizedOffer | null = useMemo(() => {
    if (!slug) return null;
    const s = decodeURIComponent(slug);
    return offersNormalized.find(o => o.slug === s) ?? null;
  }, [slug]);

  if (!offer) {
    return (
      <Section>
        <Card className="p-6">
          <div className="text-lg font-semibold mb-2">Not found</div>
          <p className="text-[var(--text-dim)]">Мы не нашли такой оффер.</p>
          <div className="mt-4">
            {/* TODO: t('compare.back') */}
            <Link to="/compare" className="btn">Back to compare</Link>
          </div>
        </Card>
      </Section>
    );
  }

  return (
    <>
      <Seo
        title={`${offer.name} — рейтинг, лицензия, выплаты`}
        description={`Детали по ${offer.name}: лицензия ${offer.license ?? "—"}, скорость выплат ${offer.payout}.`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: offer.name,
          brand: { "@type": "Organization", name: offer.name },
          aggregateRating: offer.rating
            ? { "@type": "AggregateRating", ratingValue: offer.rating, reviewCount: 1 }
            : undefined,
          offers: {
            "@type": "Offer",
            url: `${location.origin}/offers/${encodeURIComponent(offer.slug)}`,
            priceCurrency: "USD",
            price: "0",
            availability: "https://schema.org/InStock"
          },
          breadcrumb: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Offers", item: `${location.origin}/offers` },
              { "@type": "ListItem", position: 2, name: offer.name, item: `${location.origin}/offers/${encodeURIComponent(offer.slug)}` }
            ]
          }
        }}
      />

      <section className="neon-hero">
        <Section>
          <h1
            style={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(28px,4.5vw,46px)"
            }}
          >
            {offer.name}
          </h1>
          <p className="neon-subline mt-2">
            {/* TODO: i18n */}
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
                  {offer.methods.length
                    ? offer.methods.map((m, i) => (
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
              {/* CTA: трекинг внутри AffiliateLink */}
              <AffiliateLink
                offerSlug={offer.slug}
                position={1}
                href={offer.link ?? "#"}
                className="btn w-full inline-flex items-center justify-center"
              >
                {/* TODO: i18n offer.cta */}
                Play now
              </AffiliateLink>

              {/* Избранное отдельной кнопкой */}
              <FavoriteButton
                slug={offer.slug}
                isActive={isFavorite(offer.slug)}
                toggleFavorite={(slug) => toggleFavorite(slug)}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}