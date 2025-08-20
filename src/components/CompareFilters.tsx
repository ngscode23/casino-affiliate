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
      <div className="flex flex-wrap items-center gap-8">
        <div className="text-sm text-[var(--text-dim)]">
          Showing {filteredCount} of {total}
        </div>

        <div className="ml-auto flex gap-3">
          <Button
            variant="soft"
            onClick={() => onChange({ license: "all", method: "all" })}
          >
            Reset
          </Button>
          <Button onClick={() => onChange({ license: "MGA", method: "Cards" })}>
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
}