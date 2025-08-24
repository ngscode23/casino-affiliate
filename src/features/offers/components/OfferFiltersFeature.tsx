// src/features/offers/components/OfferFiltersFeature.tsx
import { useEffect, useState } from "react";
import LicenseSelect from "@/components/compare/LicenseSelect";
import { track } from "@/lib/analytics";

// Ровно тот же union, что внутри LicenseSelect
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

  // Сообщаем вверх о текущих фильтрах
  useEffect(() => {
    onChange({ license, q });
  }, [license, q, onChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div>
        <label className="block text-sm mb-1">License</label>
        {/* Важно: тип параметра, иначе TS смешает union со стандартным ChangeEvent */}
        <LicenseSelect value={license} onChange={(v: LicenseSelectValue) => setLicense(v)} />
      </div>

      <div className="sm:ml-auto">
        <label className="block text-sm mb-1" htmlFor="offers-search">Search</label>
        <input
          id="offers-search"
          className="border rounded-md px-3 py-2 min-w-[220px]"
          placeholder="Casino, method…"
          value={q}
          onChange={(e) => {
            const next = e.target.value;
            setQ(next);
            // Логируем поиск (если нужно — потом добавим debounce)
            track({ name: "toggle_filter", params: { filter: "search", value: next } });
          }}
        />
      </div>
    </div>
  );
}

export default OfferFiltersFeature;