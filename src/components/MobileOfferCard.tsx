// src/components/MobileOfferCard.tsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Info } from "lucide-react";
import Rating from "@/components/ui/rating";
import Button from "@/components/ui/button";
import CompareInline from "@/components/CompareInline";
import { FavControl } from "@/components/FavControl";



// если у тебя есть shadcn/ui sheet — оставь эти импорты.
// если нет — временно закомментируй и убери разметку Sheet ниже.
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type Offer = {
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
  selected?: boolean;
  toggle: (offer: Offer) => void;
  className?: string;
};

export function MobileOfferCard({ offer, selected = false, toggle, className = "" }: Props) {
  const methods = useMemo(() => offer.methods ?? [], [offer.methods]);

  // краткое описание для «details» шита
  const summary = useMemo(() => {
    const parts: string[] = [];
    if (offer.payout) parts.push(`Payout: ${offer.payout}${offer.payoutHours ? ` (~${offer.payoutHours}h)` : ""}`);
    if (offer.license) parts.push(`License: ${offer.license}`);
    if (typeof offer.rating === "number") parts.push(`Rating: ${offer.rating}`);
    return parts.join(" • ");
  }, [offer.payout, offer.payoutHours, offer.license, offer.rating]);

  return (
    <div className={`rounded-2xl border border-white/10 bg-[var(--bg-1)] p-4 shadow-[0_6px_24px_rgba(0,0,0,.35)] hover:shadow-[0_12px_36px_rgba(0,0,0,.45)] transition-shadow ${className}`}>
      {/* шапка карточки */}
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
          // если в твоём Button есть variant=secondary/soft — оставь.
          // иначе убери проп variant, чтобы TS не ругался.
          // @ts-ignore
          variant={selected ? "secondary" : "soft"}
          onClick={() => toggle(offer)}
          aria-pressed={selected}
        >
          {selected ? "Selected" : "Compare"}
        </Button>

        {/* Details — нижний шит (если есть shadcn/ui sheet) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              // @ts-ignore
              variant="ghost"
              aria-label={`Details for ${offer.name}`}
              className="inline-flex items-center justify-center gap-2"
            >
              Details <Info className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="max-h-[80vh] w-full rounded-t-2xl border-white/10 bg-[var(--bg-0)] text-[var(--text)] p-0 overflow-hidden"
          >
            {/* a11y для Radix */}
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
              {/* заголовок и summary */}
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
                    // @ts-ignore
                    variant={selected ? "secondary" : "soft"}
                    className="w-full"
                    onClick={() => toggle(offer)}
                    aria-pressed={selected}
                  >
                    {selected ? "Selected for compare" : "Add to compare"}
                  </Button>
                </div>

                {/* локальная панель сравнения — только на мобиле */}
                <CompareInline className="md:hidden mt-6" />
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default MobileOfferCard;

