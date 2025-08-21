// src/components/CompareFilters.tsx
import * as React from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";

export type LicenseFilter = "all" | "MGA" | "Curaçao" | "UKGC" | "Other";
export type MethodFilter  = "all" | "Cards" | "SEPA" | "Crypto" | "Paypal" | "Skrill";

type Props = {
  total: number;
  filteredCount: number;
  // контролируемые значения из родителя
  license: LicenseFilter;
  method: MethodFilter;
  // коллбэк на применение
  onChange: (v: { license: LicenseFilter; method: MethodFilter }) => void;
};

const LICENSE_OPTIONS: { label: string; value: LicenseFilter }[] = [
  { label: "All licenses", value: "all" },
  { label: "MGA",         value: "MGA" },
  { label: "UKGC",        value: "UKGC" },
  { label: "Curaçao",     value: "Curaçao" },
  { label: "Other",       value: "Other" },
];

const METHOD_OPTIONS: { label: string; value: MethodFilter }[] = [
  { label: "All methods", value: "all" },
  { label: "Cards",       value: "Cards" },
  { label: "SEPA",        value: "SEPA" },
  { label: "Crypto",      value: "Crypto" },
  { label: "Paypal",      value: "Paypal" },
  { label: "Skrill",      value: "Skrill" },
];

export default function CompareFilters({
  total,
  filteredCount,
  license,
  method,
  onChange,
}: Props) {
  // локальный черновик (для кнопки Apply)
  const [draftLicense, setDraftLicense] = React.useState<LicenseFilter>(license);
  const [draftMethod,  setDraftMethod ] = React.useState<MethodFilter>(method);

  // синхронизируем черновик, если родитель поменял состояние извне
  React.useEffect(() => { setDraftLicense(license); }, [license]);
  React.useEffect(() => { setDraftMethod(method); }, [method]);

  const apply = React.useCallback(() => {
    onChange({ license: draftLicense, method: draftMethod });
  }, [draftLicense, draftMethod, onChange]);

  const reset = React.useCallback(() => {
    setDraftLicense("all");
    setDraftMethod("all");
    onChange({ license: "all", method: "all" });
  }, [onChange]);

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center">
        <div className="text-sm text-[var(--text-dim)]">
          Showing <span className="font-medium text-[var(--text)]">{filteredCount}</span> of {total}
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 md:max-w-xl">
          <label className="block">
            <span className="sr-only">License</span>
            <select
              className="neon-input w-full"
              value={draftLicense}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDraftLicense(e.target.value as LicenseFilter)
              }
              aria-label="License filter"
            >
              {LICENSE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Payment method</span>
            <select
              className="neon-input w-full"
              value={draftMethod}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDraftMethod(e.target.value as MethodFilter)
              }
              aria-label="Payment method filter"
            >
              {METHOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="md:ml-auto btn-row">
          <Button variant="soft" onClick={reset} aria-label="Reset filters">Reset</Button>
          <Button onClick={apply} aria-label="Apply filters">Apply</Button>
        </div>
      </div>
    </Card>
  );
}