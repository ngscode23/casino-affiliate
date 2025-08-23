// src/components/OfferCardPFM.tsx
import type { NormalizedOffer } from "@/lib/offers";
import AffiliateLink from "@/components/AffiliateLink";
import { t } from "@/lib/t";

export default function OfferCardPFM({
  offer,
  index
}: {
  offer: NormalizedOffer;
  /** позиция карточки (0-based) для аналитики; необязательно */
  index?: number;
}) {
  return (
    <li className="rounded-2xl bg-white p-5 shadow-card border border-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{offer.name}</h3>

          <div className="mt-1 flex flex-wrap gap-2">
            {offer.license && (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                {t("offer.license")}: {offer.license}
              </span>
            )}
            {typeof offer.payoutHours === "number" && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs">
                {t("offer.payoutFast", "en").replace("{hours}", String(offer.payoutHours))}
              </span>
            )}
            {offer.methods.slice(0, 3).map((m) => (
              <span
                key={m}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {typeof offer.rating === "number" && (
          <div className="text-right">
            <div className="text-2xl font-extrabold text-slate-900">{offer.rating.toFixed(1)}</div>
            <div className="text-xs text-slate-500">{t("offer.ratingLabel", "ru") || "рейтинг"}</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {/* CTA через AffiliateLink — событие и rel внутри */}
     <AffiliateLink
  offerSlug={offer.slug}
  position={typeof index === "number" ? index + 1 : undefined}
  href={offer.link ?? `/go/${offer.slug}`}
  size="sm"
  className="rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700"
>
  {t("offer.cta") || "Перейти"}
</AffiliateLink>

        {/* «Сравнить» — если у тебя есть логика по #hash */}
        {offer.slug && (
          <a
            href={`#/compare?sort=rating&dir=desc&license=all&method=all&focus=${offer.slug}`}
            className="text-sm text-brand-700 hover:underline min-h-[44px] inline-flex items-center px-2"
          >
            {t("compare.compareLink") || "Сравнить"}
          </a>
        )}
      </div>
    </li>
  );
}

