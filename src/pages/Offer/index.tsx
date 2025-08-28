// src/pages/Offer/index.tsx

import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import Section from "@/components/common/section";
import Card from "@/components/common/card";
import Rating from "@/components/common/rating";
import Seo from "@/components/Seo";
import AffiliateLink from "@/components/AffiliateLink";
import { FavControl } from "@/components/FavControl";

import { offersNormalized, type NormalizedOffer } from "@/lib/offers";
import { track } from "@/lib/analytics";
import { pushRecent, getRecent } from "@/lib/recent";
// добавь импорт (вверху файла с остальными)





export default function OfferPage() {
  const { slug } = useParams<{ slug: string }>();

  const offer: NormalizedOffer | null = useMemo(() => {
    if (!slug) return null;
    const s = decodeURIComponent(slug);
    return offersNormalized.find((o) => o.slug === s) ?? null;
  }, [slug]);

  if (!offer) {
    return (
      <Section>
        <Card className="p-6">
          <div className="text-lg font-semibold mb-2">Not found</div>
          <p className="text-[var(--text-dim)]">Мы не нашли такой оффер.</p>
          <div className="mt-4">
            <Link to="/compare" className="btn">Back to compare</Link>
          </div>
        </Card>
      </Section>
    );
  }

  // FAQ для JSON-LD
  const faq = [
    { q: "Как быстро выводят средства?", a: "Обычно в течение 1–24 часов, зависит от метода." },
    { q: "Есть ли вейджер на бонусы?", a: "Да, условия зависят от акции — проверяйте правила." },
  ];

  const canonical = `${location.origin}/offers/${encodeURIComponent(offer.slug)}`;

  // JSON-LD: Product + BreadcrumbList + FAQPage
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: offer.name,
      brand: { "@type": "Organization", name: offer.name },
      aggregateRating: offer.rating
        ? { "@type": "AggregateRating", ratingValue: offer.rating, reviewCount: 1 }
        : undefined,
      offers: {
        "@type": "Offer",
        url: canonical,
        priceCurrency: "USD",
        price: "0",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Offers", item: `${location.origin}/offers` },
        { "@type": "ListItem", position: 2, name: offer.name, item: canonical },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ];

  // Пишем текущий оффер в историю (не плодит дубликаты)
useEffect(() => {
  if (offer?.slug) pushRecent(offer.slug);
}, [offer?.slug]);

  // Собираем «Недавно смотрели» (без текущего)
  const recentOffers: NormalizedOffer[] = useMemo(() => {
    const recents = getRecent().filter((s) => s !== offer.slug).slice(0, 6);
    const bySlug = new Map(offersNormalized.map((o) => [o.slug, o]));
    return recents
      .map((s) => bySlug.get(s))
      .filter(Boolean) as NormalizedOffer[];
  }, [offer.slug]);

  return (
    <>
      <Seo
        title={`${offer.name} — рейтинг, лицензия, выплаты`}
        description={`Детали по ${offer.name}: лицензия ${offer.license ?? "—"}, скорость выплат ${offer.payout}${offer.payoutHours ? ` (~${offer.payoutHours}ч)` : ""}.`}
        canonical={canonical}
        jsonLd={jsonLd}
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
              {/* CTA */}
              <AffiliateLink
                offerSlug={offer.slug}
                position={1}
                href={offer.link ?? "#"}
                className="btn w-full inline-flex items-center justify-center"
                aria-label={`Open ${offer.name}`}
              >
                Play now
              </AffiliateLink>

              <p className="mt-2 text-xs text-[var(--text-dim)]">
                Sponsored link. 18+ only. Please read{" "}
                <Link className="underline" to="/legal/affiliate-disclosure">
                  our disclosure
                </Link>{" "}
                and operator’s T&amp;Cs.
              </p>

              {/* Кнопка избранного */}
              <FavControl
                id={offer.slug}
                className="btn w-full"
                onToggle={(active: boolean) => {
                  track({
                    name: "favorite_toggle",
                    params: { offer_slug: offer.slug, active },
                  });
                }}
              />
            </div>
          </div>
        </Card>

        {/* Недавно смотрели */}
        {recentOffers.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-3">Недавно смотрели</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentOffers.map((o) => (
                <Link
                  key={o.slug}
                  to={`/offers/${encodeURIComponent(o.slug)}`}
                  className="neon-card p-4 hover:opacity-90"
                >
                  <div className="font-medium">{o.name}</div>
                  <div className="text-sm text-[var(--text-dim)]">
                    Лицензия: {o.license ?? "—"} • Выплаты: {o.payout}
                    {o.payoutHours ? ` (~${o.payoutHours}ч)` : ""}
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </Section>
    </>
  );
}