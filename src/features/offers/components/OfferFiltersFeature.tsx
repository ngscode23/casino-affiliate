import { useEffect, useState } from "react";
import LicenseSelect, { type LicenseFilter } from "@/components/compare/LicenseSelect";
import { track } from "@/lib/analytics";

export type OffersFilterState = {
  license: LicenseFilter;
  q: string;
};

export function OfferFiltersFeature({
  onChange,
}: {
  onChange: (state: OffersFilterState) => void;
}) {
  const [license, setLicense] = useState<LicenseFilter>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    onChange({ license, q });
  }, [license, q, onChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div>
        <label className="block text-sm mb-1">License</label>
        {/* теперь onChange строго (v: LicenseFilter) */}
        <LicenseSelect
          value={license}
          onChange={(val) => {
            setLicense(val);
            track({ name: "toggle_filter", params: { filter: "license", value: val } });
          }}
        />
      </div>

      <div className="sm:ml-auto">
        <label className="block text-sm mb-1">Search</label>
        <input
          className="border rounded-md px-3 py-2 min-w-[220px]"
          placeholder="Casino, method…"
          value={q}
          onChange={(e) => {
            const next = e.target.value;
            setQ(next);
            track({ name: "toggle_filter", params: { filter: "search", value: next } });
          }}
        />
      </div>
    </div>
  );
}

export default OfferFiltersFeature;