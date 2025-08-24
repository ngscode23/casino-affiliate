import { useEffect, useState } from "react";
import LicenseSelect from "@/components/compare/LicenseSelect";
import { track } from "@/lib/analytics";

export type LicenseSelectValue = "all" | "MGA" | "UKGC" | "Curaçao";
export type OffersFilterState = { license: LicenseSelectValue; q: string };

export function OfferFiltersFeature({ onChange }: { onChange: (state: OffersFilterState) => void }) {
  const [license, setLicense] = useState<LicenseSelectValue>("all");
  const [q, setQ] = useState("");

  useEffect(() => { onChange({ license, q }); }, [license, q, onChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div>
        <label className="block text-sm mb-1">License</label>
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
          className="border rounded-md px-3 py-2 min-w-[220px] bg-[var(--bg-1)] text-[var(--text)]"
          placeholder="Casino, method…"
          value={q}
          onChange={(e) => {
            const next = e.currentTarget.value;
            setQ(next);
            track({ name: "toggle_filter", params: { filter: "search", value: next } });
          }}
        />
      </div>
    </div>
  );
}