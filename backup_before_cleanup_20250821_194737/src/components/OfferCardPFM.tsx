import type { Offer } from "../data/schema";


export default function OfferCardPFM({ offer }: { offer: Offer }) {
  return (
    <li className="rounded-2xl bg-white p-5 shadow-card border border-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{offer.name}</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {offer.license && (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                Лицензия: {offer.license}
              </span>
            )}
            {typeof offer.payoutHours === "number" && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs">
                Выплата ~{offer.payoutHours}ч
              </span>
            )}
               {offer.methods?.slice(0, 3).map((m: string) => (
  <span key={m} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
    {m}
              </span>
            ))}
          </div>
        </div>

        {typeof offer.rating === "number" && (
          <div className="text-right">
            <div className="text-2xl font-extrabold text-slate-900">
              {offer.rating.toFixed(1)}
            </div>
            <div className="text-xs text-slate-500">рейтинг</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <a
          href={offer.link ?? `/go/${offer.slug}`}
          className="rounded-lg bg-brand-600 px-4 py-2 text-white font-semibold hover:bg-brand-700"
          rel={offer.link?.startsWith("http") ? "nofollow sponsored" : undefined}
        >
          Перейти
        </a>

        {offer.slug && (
          <a
            href={`#/compare?sort=rating&dir=desc&license=all&method=all&focus=${offer.slug}`}
            className="text-sm text-brand-700 hover:underline"
          >
            Сравнить
          </a>
        )}
      </div>

      {/* JSON-LD для SEO */}
      
      {typeof offer.rating === "number" && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: offer.name,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: offer.rating.toFixed(1),
                reviewCount: 100, // TODO: подставить реальное число отзывов
              },
            }),
          }}
        />
      )}
    </li>
  );
}