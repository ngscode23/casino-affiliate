import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Section from "@/ui/Section";
import Card from "@/ui/Card";
import Rating from "@/ui/Rating";
import { Button } from "@/components/ui/button";

// Источник данных. У тебя уже есть casinos — используем его.
// Если у тебя другой файл/экспорт — поправь импорт.
import { casinos } from "@/data/casinos";

type OfferItem = {
  slug?: string;
  name: string;
  rating: number;
  license: string;
  payout: string;
  payoutHours?: number;
  methods?: string[];
  payments?: string[];
  link?: string;
  enabled?: boolean;
  position?: number;
};

export default function OfferPage() {
  const { slug } = useParams<{ slug: string }>();

  const offer: OfferItem | undefined = useMemo(() => {
    if (!slug) return undefined;
    const bySlug = casinos.find(o => (o.slug ?? "").toLowerCase() === slug.toLowerCase());
    if (bySlug) return bySlug;
    // запасной вариант: по имени
    return casinos.find(o => o.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase());
  }, [slug]);

  if (!offer) {
    return (
      <Section>
        <div className="neon-card p-6">
          <h1 className="text-xl font-semibold">Оффер не найден</h1>
          <p className="mt-2 text-[var(--text-dim)]">Возможно, ссылка устарела или оффер выключен.</p>
          <div className="mt-4">
            <Button asChild>
              <Link to="/">На главную</Link>
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  const methods = offer.methods ?? offer.payments ?? [];
  const payoutHint =
    offer.payoutHours != null
      ? offer.payoutHours <= 24 ? "очень быстрые выплаты" :
        offer.payoutHours <= 48 ? "быстрые выплаты" : "средняя скорость выплат"
      : "стабильные выплаты";

  return (
    <>
      {/* HERO секция */}
      <section className="neon-hero">
        <Section>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="neon-chip" data-glow>{offer.license}</span>
            {offer.payoutHours != null && <span className="neon-chip" data-glow>~{offer.payoutHours}h payout</span>}
            <span className="neon-chip" data-glow>{payoutHint}</span>
          </div>

          <h1 style={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(28px,4.5vw,46px)" }}>
            {offer.name}
          </h1>

          <p className="neon-subline mt-2">
            Рейтинг, лицензия, методы выплат и быстрый старт.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild>
              <a
                href={offer.link ?? "#"}
                target={offer.link?.startsWith("http") ? "_blank" : undefined}
                rel={offer.link?.startsWith("http") ? "nofollow sponsored noopener" : undefined}
              >
                Играть сейчас
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/compare">Сравнить в таблице</Link>
            </Button>
          </div>
        </Section>
      </section>

      {/* Основной контент */}
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Левая колонка */}
          <Card className="p-4 md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-[var(--text-dim)] text-sm">Рейтинг</div>
                <div className="mt-2"><Rating value={offer.rating} /></div>
              </div>
              <div>
                <div className="text-[var(--text-dim)] text-sm">Лицензия</div>
                <div className="mt-2">{offer.license}</div>
              </div>
              <div>
                <div className="text-[var(--text-dim)] text-sm">Выплаты</div>
                <div className="mt-2">{offer.payout}{offer.payoutHours ? ` (~${offer.payoutHours}h)` : ""}</div>
              </div>
              <div>
                <div className="text-[var(--text-dim)] text-sm">Методы</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {methods.length ? methods.map((m, i) => (
                    <span key={`${m}-${i}`} className="neon-chip">{m}</span>
                  )) : "—"}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">Почему рекомендуем</h2>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-sm">
                <li>Прозрачные условия бонусов</li>
                <li>Адекватная скорость вывода средств</li>
                <li>Поддержка популярных методов оплаты</li>
              </ul>
            </div>
          </Card>

          {/* Правая колонка */}
          <Card className="p-4 h-fit">
            <div className="text-[var(--text-dim)] text-sm">Быстрый старт</div>
            <div className="mt-3">
              <Button asChild className="w-full">
                <a
                  href={offer.link ?? "#"}
                  target={offer.link?.startsWith("http") ? "_blank" : undefined}
                  rel={offer.link?.startsWith("http") ? "nofollow sponsored noopener" : undefined}
                >
                  Играть сейчас
                </a>
              </Button>
            </div>
            <div className="mt-3">
              <Button variant="secondary" asChild className="w-full">
                <Link to="/compare">Открыть сравнение</Link>
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}