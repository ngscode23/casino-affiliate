// src/components/MobileOfferCard.tsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink} from "lucide-react";

import Rating from "@/components/ui/rating";
import CompareInline from "@/components/CompareInline";
import { FavControl } from "@/components/FavControl";
import AffiliateLink from "@/components/AffiliateLink";
import { t } from "@/lib/t";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";

import { useCompare } from "@/ctx/CompareContext";
import type { NormalizedOffer } from "@/lib/offers";

type Props = {
  offer: NormalizedOffer;
  className?: string;
  /** позиция карточки (0-based) для аналитики; необязательно */
  index?: number;
};

export default function MobileOfferCard({ offer, className = "", index }: Props) {
  const { toggle: toggleCompare, isSelected } = useCompare();
  const id = offer.slug;
  const selected = isSelected(id);

  const methods = useMemo(() => offer.methods ?? [], [offer.methods]);

  const summary = useMemo(() => {
    const parts: string[] = [];
    if (offer.payout) parts.push(`Payout: ${offer.payout}${offer.payoutHours ? ` (~${offer.payoutHours}h)` : ""}`);
    if (offer.license) parts.push(`License: ${offer.license}`);
    if (typeof offer.rating === "number") parts.push(`Rating: ${offer.rating}`);
    return parts.join(" • ");
  }, [offer.payout, offer.payoutHours, offer.license, offer.rating]);

  const position = index != null ? index + 1 : undefined;

  return (
    <div className={`rounded-2xl border border-white/10 bg-[var(--bg-1)] p-4 shadow-[0_6px_24px_rgba(0,0,0,.35)] hover:shadow-[0_12px_36px_rgba(0,0,0,.45)] transition-shadow ${className}`}>
      {/* шапка */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="text-base font-semibold truncate">{offer.name}</div>
          <div className="text-xs text-[var(--text-dim)]">{offer.license}</div>
        </div>
        <div className="shrink-0">
          <Rating value={offer.rating ?? 0} />
        </div>
      </div>

      {/* краткая инфа */}
      <div className="mt-3 text-sm">
        Payout: {offer.payout}
        {offer.payoutHours ? ` (~${offer.payoutHours}h)` : ""}
      </div>

      {/* методы */}
      {methods.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {methods.map((m, i) => (
            <span key={`${m}-${i}`} className="neon-chip">
              {m}
            </span>
          ))}
        </div>
      )}

      {/* избранное */}
      <div className="mt-3">
        <FavControl id={id} />
      </div>

      {/* действия */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {/* CTA: НЕ оборачиваем в Button, сразу AffiliateLink с нужными классами */}
        <AffiliateLink
          offerSlug={offer.slug}
          position={position}
          href={offer.link ?? "#"}
          className="btn w-full inline-flex items-center justify-center gap-2"
          aria-label={`Open ${offer.name}`}
        >
          {t("offer.cta") || "Play"} <ExternalLink className="h-4 w-4" />
        </AffiliateLink>

        {/* Compare toggle */}
      <button
  type="button"
  className={`btn ${selected ? "btn-secondary" : "btn-soft"} min-h-[44px] px-3 py-2 text-[13px] leading-[1.1]`}
  onClick={() => toggleCompare(offer)}
  aria-pressed={selected}
>
  {selected ? t("compare.selected") : t("compare.add")}
</button>

        {/* Details (sheet) */}
        <Sheet>
          <SheetTrigger asChild>
          <button
  type="button"
  className={`btn ${selected ? "btn-secondary" : "btn-soft"} w-full min-h-[44px] px-3 py-2 text-[13px] leading-[1.1]`}
  onClick={() => toggleCompare(offer)}
  aria-pressed={selected}
>
  {selected ? t("compare.selectedFor") : t("compare.addTo")}
</button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="max-h[80vh] w-full rounded-t-2xl border-white/10 bg-[var(--bg-0)] text-[var(--text)] p-0 overflow-hidden"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>{offer.name}</SheetTitle>
              <SheetDescription>Casino details</SheetDescription>
            </SheetHeader>

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="p-6"
            >
              {/* summary */}
              <div>
                <div className="text-base sm:text-lg font-semibold">{offer.name}</div>
                <div className="mt-1 text-[var(--text-dim)]">{summary}</div>
              </div>

              <div className="mt-6 space-y-6 text-sm">
                {/* характеристики */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[var(--text-dim)]">Rating</div>
                    <div className="mt-1">
                      <Rating value={offer.rating ?? 0} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[var(--text-dim)]">License</div>
                    <div className="mt-1">{offer.license}</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-dim)]">Payout</div>
                    <div className="mt-1">
                      {offer.payout}
                      {offer.payoutHours ? ` (~${offer.payoutHours}h)` : ""}
                    </div>
                  </div>
                  <div>
                    <div className="text-[var(--text-dim)]">Methods</div>
                    <div className="mt-1 flex flex-wrap gap-2">
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

                {/* actions в шите */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <FavControl id={id} />

                  <AffiliateLink
                    offerSlug={offer.slug}
                    position={position}
                    href={offer.link ?? "#"}
                    className="btn w-full inline-flex items-center justify-center gap-2"
                    aria-label={`Open ${offer.name}`}
                  >
                    {t("offer.cta") || "Play"} <ExternalLink className="h-4 w-4" />
                  </AffiliateLink>

                 <button
  type="button"
  className={`btn ${selected ? "btn-secondary" : "btn-soft"} w-full min-h-[44px] px-3 py-2 text-[13px] leading-[1.1]`}
  onClick={() => toggleCompare(offer)}
  aria-pressed={selected}
>
  {selected ? t("compare.selectedFor") : t("compare.addTo")}
</button>
                </div>

                {/* локальная панель сравнения */}
                <CompareInline className="md:hidden mt-6" />
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}