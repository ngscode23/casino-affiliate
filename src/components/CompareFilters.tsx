// src/components/CompareFilters.tsx
import Button from "../ui/Button";
import Card from "../ui/Card";

export type LicenseFilter = "all" | "MGA" | "Curaçao" | "UKGC" | "Other";
export type MethodFilter  = "all" | "Cards" | "SEPA" | "Crypto" | "Paypal" | "Skrill";

type Props = {
  total: number;
  filteredCount: number;
  onChange: (v: { license: LicenseFilter; method: MethodFilter }) => void;
};

export default function CompareFilters({ total, filteredCount, onChange }: Props) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-4 sm:gap-8">
        {/* счетчик */}
        <div className="text-sm text-[var(--text-dim)]">
          Showing {filteredCount} of {total}
        </div>

        {/* кнопки справа: на мобиле столбиком и на всю ширину */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="soft"
            className="w-full sm:w-auto"
            onClick={() => onChange({ license: "all", method: "all" })}
          >
            Reset
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => onChange({ license: "MGA", method: "Cards" })}
          >
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
}