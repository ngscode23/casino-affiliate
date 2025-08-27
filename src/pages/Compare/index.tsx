// src/pages/Compare/index.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

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

  // отражаем поиск в URL ?q=
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (search) next.set("q", search);
    else next.delete("q");
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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

    // уходим от офферов, которые уже в избранном
    arr = arr.filter((o) => !!o.slug && !favItems.includes(o.slug));

    return arr;
  }, [offers, license, method, search, favItems]);

  const origin = safeOrigin();
  const errText =
    typeof error === "string" ? error : (error as any)?.message ?? "";


  const faqCompare: FaqItem[] = [
  { q: "Как пользоваться сравнением?", a: "Выберите фильтры по лицензии и методам, отсортируйте таблицу по нужному параметру." },
  { q: "Что означает рейтинг?", a: "Комплексная оценка: выплаты, удобство, поддержка и условия бонусов." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqCompare.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};


  return (
    <section className="neon-container space-y-6">
    <Seo jsonLd={faqJsonLd} />

        title="Сравнение казино — выплаты, бонусы, лицензии"
        description="Сравните казино по рейтингу, лицензиям, методам пополнения и скорости вывода."
        canonical={origin ? `${origin}/compare` : undefined}
        jsonLd={{
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
        }}
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
    </section>
  );
}