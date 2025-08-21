import { useMemo } from "react";
import Rating from "../ui/Rating";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Info, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useCompare } from "@/ctx/CompareContext";

export type MobileOffer = {
  slug?: string;
  name: string;
  rating: number;
  license: string;
  payout: string;
  payoutHours?: number;
  methods?: string[];
  payments?: string[];
  link?: string;
};

export default function MobileOfferCard({ offer }: { offer: MobileOffer }) {
  const { toggle, isSelected } = useCompare();
  const selected = isSelected(offer); // ✅ теперь проверяем по самому офферу

  const methods = offer.methods ?? offer.payments ?? [];

  // краткое описание для шита (можешь заменить реальным контентом)
  const summary = useMemo(() => {
    const speed =
      offer.payoutHours != null
        ? offer.payoutHours <= 24
          ? "очень быстрые выплаты"
          : offer.payoutHours <= 48
          ? "быстрые выплаты"
          : "средняя скорость выплат"
        : "стабильные выплаты";

    const trust =
      offer.rating >= 4.6
        ? "высокий пользовательский рейтинг"
        : offer.rating >= 4.2
        ? "хороший пользовательский рейтинг"
        : "средний пользовательский рейтинг";

    return `${offer.name}: ${speed}, ${trust}. Лицензия ${offer.license}.`;
  }, [offer]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--bg-1)] p-4 shadow-[0_6px_24px_rgba(0,0,0,0.35)]">
      {/* верх карточки */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="text-base font-semibold truncate">{offer.name}</div>
          <div className="text-xs text-[var(--text-dim)]">{offer.license}</div>
        </div>
        <div className="shrink-0">
          <Rating value={offer.rating} />
        </div>
      </div>

      {/* короткая инфа */}
      <div className="mt-3 text-sm">Payout: {offer.payout}</div>

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
        <Button asChild>
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
          onClick={() => toggle(offer)}
          aria-pressed={selected}
        >
          {selected ? "Selected" : "Compare"}
        </Button>

        {/* Details (sheet снизу) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="inline-flex items-center justify-center gap-2">
              Details <Info className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="max-h-[80vh] w-full rounded-t-2xl border-white/10 bg-[var(--bg-0)] text-[var(--text)] p-0 overflow-hidden"
          >
            {/* a11y для Radix — Title/Description обязательны */}
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
              {/* Заголовок и summary */}
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
                      <Rating value={offer.rating} />
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

                {/* почему рекомендуем */}
                <div className="rounded-xl border border-white/10 bg-[var(--bg-1)] p-4">
                  <div className="text-[var(--text-dim)] mb-2">Why we like it</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Прозрачные условия бонусов</li>
                    <li>Адекватная скорость вывода</li>
                    <li>Поддержка популярных методов оплаты</li>
                  </ul>
                </div>

                {/* действия в шите */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button asChild className="w-full">
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
                    onClick={() => toggle(offer)}
                    aria-pressed={selected}
                  >
                    {selected ? "Selected for compare" : "Add to compare"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}