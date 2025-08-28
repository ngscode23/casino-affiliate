// src/pages/Compare/index.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import CompareFilters, {
  type LicenseFilter,
  type MethodFilter,
} from "@/components/compare/CompareFilters";
import CompareTable, { type SortKey } from "@/components/compare/CompareTable";
import MobileOfferCard from "@/components/offers/MobileOfferCard";
import Seo from "@/components/Seo";
import type { NormalizedOffer } from "@/lib/offers";
import { useOffers } from "@/features/offers/api/useOffers";
import { useFavorites } from "@/lib/useFavorites";
import Faq, { type FaqItem } from "@/components/faq/FAQ";
import { getRecent } from "@/lib/recent";
import { offersNormalized } from "@/lib/offers";

function normalizeStr(s: string) {
  return s.toLowerCase().normalize("NFKD");
}

function safeOrigin(): string | undefined {
  try {
    return typeof location !== "undefined" ? location.origin : undefined;
  } catch {
    return undefined;
  }
}

export default function ComparePage() {
  const { offers, isLoading, error } = useOffers();

  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") ?? "";

  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [license, setLicense] = useState<LicenseFilter>("all");
  const [method, setMethod] = useState<MethodFilter>("all");
  const [search, setSearch] = useState<string>(initialQ);
useEffect(() => {
  const s = (params.get("sort") as SortKey) || "rating";
  const d = (params.get("dir") as "asc" | "desc") || "desc";
  const lic = (params.get("license") as LicenseFilter) || "all";
  const mth = (params.get("method") as MethodFilter) || "all";
  setSortKey(s);
  setSortDir(d);
  setLicense(lic);
  setMethod(mth);
  // только на первый рендер
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  // отражаем поиск в URL ?q=
useEffect(() => {
  const next = new URLSearchParams(params);
  // search
  if (search) next.set("q", search); else next.delete("q");
  // sort
  next.set("sort", sortKey);
  next.set("dir", sortDir);
  // filters
  if (license !== "all") next.set("license", license); else next.delete("license");
  if (method !== "all") next.set("method", method); else next.delete("method");

  setParams(next, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [search, sortKey, sortDir, license, method]);
  // избранное — убираем их из выдачи сравнения
  const { items: favItems } = useFavorites();

  const filtered: NormalizedOffer[] = useMemo(() => {
    let arr = [...offers];

    if (license !== "all") arr = arr.filter((o) => o.license === license);
    if (method !== "all") arr = arr.filter((o) => o.methods.includes(method));

    if (search.trim()) {
      const q = normalizeStr(search.trim());
      arr = arr.filter((o) => {
        const hay = [o.name, o.license, ...(o.methods ?? [])].join(" ");
        return normalizeStr(hay).includes(q);
      });
    }

    // исключаем офферы, которые уже в избранном
    arr = arr.filter((o) => !!o.slug && !favItems.includes(o.slug));

    return arr;
  }, [offers, license, method, search, favItems]);

  const origin = safeOrigin();
  const errText = typeof error === "string" ? error : (error as any)?.message ?? "";

  const faqCompare: FaqItem[] = [
    {
      q: "Как пользоваться сравнением?",
      a: "Выберите фильтры по лицензии и методам, отсортируйте таблицу по нужному параметру.",
    },
    {
      q: "Что означает рейтинг?",
      a: "Комплексная оценка: выплаты, удобство, поддержка и условия бонусов.",
    },
  ];

  // Собираем всё JSON-LD в один массив
  const jsonLd = useMemo(() => {
    const webPage = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Сравнение казино",
      url: origin ? `${origin}/compare` : "/compare",
    };

    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: filtered.map((o, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: origin
          ? `${origin}/offers/${encodeURIComponent(o.slug)}`
          : `/offers/${encodeURIComponent(o.slug)}`,
        name: o.name,
      })),
    };

    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqCompare.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    };

    return [webPage, itemList, faq];
  }, [filtered, origin, faqCompare]);

const recent = getRecent().slice(0, 6);
const recentOffers = offersNormalized.filter(o => recent.includes(o.slug));

return (
  <>
    <Seo
      title="Сравнение казино — выплаты, бонусы, лицензии"
      description="Сравните казино по рейтингу, лицензиям, методам пополнения и скорости вывода."
      canonical={origin ? `${origin}/compare` : undefined}
      jsonLd={jsonLd}
    />

    <section className="neon-container space-y-6">
      <Faq items={faqCompare} className="neon-card p-4 mt-6" />

      <div className="neon-card p-4">
        <CompareFilters
          total={offers.length}
          filteredCount={filtered.length}
          license={license}
          method={method}
          search={search}
          onChange={({ license: nextLicense, method: nextMethod }) => {
            if (nextLicense !== license) setLicense(nextLicense);
            if (nextMethod !== method) setMethod(nextMethod);
          }}
          onSearchChange={setSearch}
        />
      </div>

      {/* заглушки/ошибки */}
      {errText && (
        <div className="neon-card p-3 text-red-400">
          Ошибка загрузки офферов: {errText}
        </div>
      )}

      {/* мобайл карточки */}
      <div className="grid gap-3 sm:gap-4 md:hidden">
        {(isLoading ? [] : filtered).map((o) => (
          <MobileOfferCard key={o.slug} offer={o} />
        ))}
      </div>

      {/* десктоп таблица */}
      <div className="neon-card p-0 hidden md:block">
        <CompareTable
          offers={filtered}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={(k, d) => {
            setSortKey(k);
            setSortDir(d);
          }}
        />
      </div>


{/* Топ быстрых выплат (десктоп/мобайл общий) */}
{filtered.length > 0 && (
  <div className="neon-card p-4">
    <h2 className="text-lg font-semibold mb-3">Топ быстрых выплат</h2>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {filtered
        .slice() // копия
        .sort((a, b) => (a.payoutHours ?? 9999) - (b.payoutHours ?? 9999))
        .slice(0, 6)
        .map(o => (
          <a key={o.slug} href={`/offers/${encodeURIComponent(o.slug)}`} className="neon-card p-4 hover:opacity-90">
            <div className="font-medium">{o.name}</div>
            <div className="text-sm text-[var(--text-dim)]">
              Выплаты: {o.payout}{o.payoutHours ? ` (~${o.payoutHours}ч)` : ""}
            </div>
          </a>
        ))}
    </div>
  </div>
)}

      {/* недавно смотрели */}
      {recentOffers.length > 0 && (
        <div className="neon-card p-4">
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
        </div>
      )}
    </section>
  </>
);
  
}

// синхронизация всех контролов с URL
