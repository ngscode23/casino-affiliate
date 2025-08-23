// src/features/offers/components/OfferFiltersFeature.tsx
import { useEffect, useState } from "react";
import LicenseSelect, { type LicenseFilter } from "@/components/compare/LicenseSelect";

export type OffersFilterState = { license: LicenseFilter; q: string };

export function OfferFiltersFeature({ onChange }: { onChange: (s: OffersFilterState) => void }) {
  const [license, setLicense] = useState<LicenseFilter>("all");
  const [q, setQ] = useState("");

  useEffect(() => { onChange({ license, q }); }, [license, q, onChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div>
        <label className="block text-sm mb-1">License</label>
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