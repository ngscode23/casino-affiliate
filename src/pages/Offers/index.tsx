// src/pages/Offers/Index.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

import Section from "@/components/common/section";
import Card from "@/components/common/card";

import OfferListFeature from "@/features/offers/components/OfferListFeature";
import { OfferFiltersFeature } from "@/features/offers/components/OfferFiltersFeature";

// тот же union, что и в LicenseSelect
type LicenseSelectValue = "all" | "MGA" | "UKGC" | "Curaçao";

export default function OffersIndex() {
  const [filters, setFilters] = useState<{ license: LicenseSelectValue; q: string }>({
    license: "all",
    q: "",
  });

  return (
    <Section className="space-y-6">
      <h1 className="text-2xl font-bold">All Offers</h1>

      <Card className="p-4">
        <OfferFiltersFeature onChange={setFilters} />
      </Card>

      {/* Поки что OfferListFeature не принимает фильтры — подключим позже */}

<OfferListFeature license={filters.license} q={filters.q} />

      <Card className="p-6 space-y-2">
        <p className="text-[var(--text-dim)]">
          Список офферов как отдельная витрина. Основная таблица сравнения — на странице Compare.
        </p>
        <Link className="underline cursor-pointer" to="/compare">
          → Go to Compare
        </Link>
      </Card>
    </Section>
  );
}