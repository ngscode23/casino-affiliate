// src/components/MobileOfferCard.tsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Info } from "lucide-react";

import Rating from "@/components/ui/rating";
import Button from "@/components/ui/button";
import CompareInline from "@/components/CompareInline";
import { FavControl } from "@/components/FavControl";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { useCompare } from "@/ctx/CompareContext";

// Если у тебя есть общий тип Offer — можешь импортировать его из "@/types/offer"
// import type { Offer } from "@/types/offer";
type Offer = {
  slug?: string;
  name: string;
  license?: string;
  rating?: number;
  payout?: string;
  payoutHours?: number;
  methods?: string[];
  link?: string | null;
};

type Props = {
  offer: Offer;
  className?: string;
};

export default function MobileOfferCard({ offer, className = "" }: Props) {
  const { toggle: toggleCompare, isSelected } = useCompare();
  const id = offer.slug ?? offer.name;
  const selected = isSelected(id);

  const methods = useMemo(() => offer.methods ?? [], [offer.methods]);

  const summary = useMemo(() => {
    const parts: string[] = [];
    if (offer.payout)
      parts.push(
        `Payout: ${offer.payout}${offer.payoutHours ? ` (~${offer.payoutHours}h)` : ""}`
      );
    if (offer.license) parts.push(`License: ${offer.license}`);
    if (typeof offer.rating === "number") parts.push(`Rating: ${offer.rating}`);
    return parts.join(" • ");
  }, [offer.payout, offer.payoutHours, offer.license, offer.rating]);

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[var(--bg-1)] p-4 shadow-[0_6px_24px_rgba(0,0,0,.35)] hover:shadow-[0_12px_36px_rgba(0,0,0,.45)] transition-shadow ${className}`}
    >
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
        {/* Play */}
        <Button aria-label={`Open ${offer.name}`}>
          <a
            href={offer.link ?? "#"}
            className="inline-flex items-center justify-center gap-2"
            target={offer.link?.startsWith("http") ? "_blank" : undefined}
            rel={offer.link?.startsWith("http") ? "nofollow sponsored noopener" : undefined}
          >
            Play <ExternalLink className="h-4 w-4" />
          </a>
        </Button>

        {/* Compare toggle */}
        <Button
          variant={selected ? "secondary" : "soft"}
          onClick={() => toggleCompare(offer)}
          aria-pressed={selected}
        >
          {selected ? "Selected" : "Compare"}
        </Button>

        {/* Details (sheet) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" aria-label={`Details for ${offer.name}`} className="inline-flex items-center justify-center gap-2">
              Details <Info className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="max-h-[80vh] w-full rounded-t-2xl border-white/10 bg-[var(--bg-0)] text-[var(--text)] p-0 overflow-hidden"
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

                {/* действия в шите */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button className="w-full">
                    <a
                      href={offer.link ?? "#"}
                      target={offer.link?.startsWith("http") ? "_blank" : undefined}
                      rel={offer.link?.startsWith("http") ? "nofollow sponsored noopener" : undefined}
                    >
                      Play now
                    </a>
                  </Button>

                  <Button
                    variant={selected ? "secondary" : "soft"}
                    className="w-full"
                    onClick={() => toggleCompare(offer)}
                    aria-pressed={selected}
                  >
                    {selected ? "Selected for compare" : "Add to compare"}
                  </Button>
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