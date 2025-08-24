import { useState } from "react";
import { Link } from "react-router-dom";
import Section from "@/components/common/section";
import Card from "@/components/common/card";
import Seo from "@/components/Seo";

import OfferListFeature, { type OffersFilterState, type LicenseSelectValue } from "@/features/offers/components/OfferListFeature";
import { OfferFiltersFeature } from "@/features/offers/components/OfferFiltersFeature";

export default function OffersIndex() {
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

      <OfferListFeature filters={filters} />

      <Card className="p-6 space-y-2">
        <p className="text-[var(--text-dim)]">
          Список офферов как отдельная витрина. Основная таблица сравнения — на странице Compare.
        </p>
        <Link className="underline cursor-pointer" to="/compare">→ Go to Compare</Link>
      </Card>
    </Section>
  );
}