// src/components/CompareFilters.tsx
import * as React from "react";
import Button from '../components/ui/Button";
import Card from '../components/ui/Card";

export type LicenseFilter = "all" | "MGA" | "Curaçao" | "UKGC" | "Other";
export type MethodFilter  = "all" | "Cards" | "SEPA" | "Crypto" | "Paypal" | "Skrill";

type Props = {
  total: number;
  filteredCount: number;

  // controlled-пропсы из родителя
  license: LicenseFilter;
  method: MethodFilter;
  search: string;

  // коллбэки наверх
  onChange: (v: { license: LicenseFilter; method: MethodFilter }) => void;
  onSearchChange: (value: string) => void;
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
  search,
  onChange,
  onSearchChange,
}: Props) {
  // локальный драфт для Apply/Reset (license/method)
  const [draftLicense, setDraftLicense] = React.useState<LicenseFilter>(license);
  const [draftMethod,  setDraftMethod]  = React.useState<MethodFilter>(method);

  // если родитель снаружи поменял license/method — синхронизируем драфт
  React.useEffect(() => { setDraftLicense(license); }, [license]);
  React.useEffect(() => { setDraftMethod(method);   }, [method]);

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
        {/* Счётчик */}
        <div className="text-sm text-[var(--text-dim)]">
          Showing <span className="font-medium text-[var(--text)]">{filteredCount}</span> of {total}
        </div>

        {/* Блок поиска + селекты */}
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:max-w-3xl">
          {/* Поиск (контроллируется родителем, без Apply) */}
          <label className="block">
            <span className="sr-only">Search</span>
            <input
              className="neon-input w-full"
              placeholder="Search casinos, licenses, methods…"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              aria-label="Search"
            />
          </label>

          {/* License (локальный драфт) */}
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
              {LICENSE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          {/* Method (локальный драфт) */}
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
              {METHOD_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Кнопки */}
        <div className="md:ml-auto btn-row">
          <Button variant="soft" onClick={reset} aria-label="Reset filters">Reset</Button>
          <Button onClick={apply} aria-label="Apply filters">Apply</Button>
        </div>
      </div>
    </Card>
  );
}
