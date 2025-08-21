// src/components/CompareFilters.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Card from "../ui/Card";

export type LicenseFilter = "all" | "MGA" | "Curaçao" | "UKGC" | "Other";
export type MethodFilter  = "all" | "Cards" | "SEPA" | "Crypto" | "Paypal" | "Skrill";

type Props = {
  total: number;
  filteredCount: number;
  onChange: (v: { license: LicenseFilter; method: MethodFilter }) => void;
};

export default function CompareFilters({ total, filteredCount, onChange }: Props) {
  // локальные черновые значения (то, что применится по Apply)
  const [license, setLicense] = useState<LicenseFilter>("all");
  const [method, setMethod]   = useState<MethodFilter>("all");

  const reset = () => {
    setLicense("all");
    setMethod("all");
    onChange({ license: "all", method: "all" });
  };

  const apply = () => {
    onChange({ license, method });
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="text-sm text-[var(--text-dim)]">
          Showing {filteredCount} of {total}
        </div>

        {/* Контролы фильтров */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-[var(--text-dim)]">License</label>
          <select
            className="neon-input !h-9"
            value={license}
            onChange={(e) => setLicense(e.target.value as LicenseFilter)}
          >
            <option value="all">All</option>
            <option value="MGA">MGA</option>
            <option value="Curaçao">Curaçao</option>
            <option value="UKGC">UKGC</option>
            <option value="Other">Other</option>
          </select>

          <label className="text-sm text-[var(--text-dim)] ml-2">Method</label>
          <select
            className="neon-input !h-9"
            value={method}
            onChange={(e) => setMethod(e.target.value as MethodFilter)}
          >
            <option value="all">All</option>
            <option value="Cards">Cards</option>
            <option value="SEPA">SEPA</option>
            <option value="Crypto">Crypto</option>
            <option value="Paypal">Paypal</option>
            <option value="Skrill">Skrill</option>
          </select>
        </div>

        {/* Кнопки справа */}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="soft" onClick={reset}>Reset</Button>
          <Button onClick={apply}>Apply</Button>
        </div>
      </div>
    </Card>
  );
}