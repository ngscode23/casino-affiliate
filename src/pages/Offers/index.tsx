// src/pages/Offers/index.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

import Section from "@/components/common/section";
import Card from "@/components/common/card";
import Seo from "@/components/Seo";

import OfferListFeature from "@/features/offers/components/OfferListFeature";
import { OfferFiltersFeature, type OffersFilterState } from "@/features/offers/components/OfferFiltersFeature";
import { useOffers } from "@/features/offers/api/useOffers";

export default function OffersIndex() {
  const { offers, isLoading, error } = useOffers();
  const [filters, setFilters] = useState<OffersFilterState>({ license: "all", q: "" });

  return (
    <Section className="space-y-6">
      <Seo
        title="All Casino Offers — browse & filter"
        description="Листайте карточки казино, фильтруйте по лицензиям и методам выплат."
        canonical={`${location.origin}/offers`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "All Casino Offers",
        }}
      />

      <h1 className="text-2xl font-bold">All Offers</h1>

      <Card className="p-4">
        <OfferFiltersFeature onChange={setFilters} />
      </Card>

      {isLoading ? (
        <Card className="p-6">Загрузка…</Card>
      ) : error ? (
        <Card className="p-6 text-red-400">Ошибка: {error}</Card>
      ) : (
        <OfferListFeature offers={offers} filters={filters} />
      )}

      <Card className="p-6 space-y-2">
        <p className="text-[var(--text-dim)]">
          Список офферов как отдельная витрина. Основная таблица сравнения — на странице Compare.
        </p>
        <Link className="underline cursor-pointer" to="/compare">→ Go to Compare</Link>
      </Card>
    </Section>
  );
}