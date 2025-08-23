// src/features/offers/components/OfferFiltersFeature.tsx
import { useEffect, useState } from "react";
import LicenseSelect from "@/components/compare/LicenseSelect";

// ВАЖНО: берем ровно тот union, который поддерживает LicenseSelect
type LicenseSelectValue = "all" | "MGA" | "UKGC" | "Curaçao";

export type OffersFilterState = {
  license: LicenseSelectValue;
  q: string;
};

export function OfferFiltersFeature({
  onChange,
}: {
  onChange: (state: OffersFilterState) => void;
}) {
  const [license, setLicense] = useState<LicenseSelectValue>("all");
  const [q, setQ] = useState("");

  // триггерим коллбек корректно (не useMemo)
  useEffect(() => {
    onChange({ license, q });
  }, [license, q, onChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div>
        <label className="block text-sm mb-1">License</label>
        {/* НЕ передаём setLicense напрямую — нужна обёртка по типу */}
        <LicenseSelect value={license} onChange={(v) => setLicense(v)} />
      </div>

      <div className="sm:ml-auto">
        <label className="block text-sm mb-1">Search</label>
        <input
          className="border rounded-md px-3 py-2 min-w-[220px]"
          placeholder="Casino, method…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
    </div>
  );
}

export default OfferFiltersFeature;