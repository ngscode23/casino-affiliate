// src/components/CompareFilters.tsx
import { useEffect, useMemo, useState } from "react";
import { parseHash, writeHash, type LicenseFilter, type MethodFilter } from "../lib/hashState";
import { track } from "../lib/analytics";
import Seo from "../components/Seo";

type Props = {
  total: number;
  filteredCount: number;
  onChange?: (s: { license: LicenseFilter; method: MethodFilter }) => void;
};

const LICENSES = ["all", "MGA", "Curaçao", "UKGC", "Other"] as const;
type License = typeof LICENSES[number]; // "all" | "MGA" | ...

const METHODS = ["all", "Cards", "SEPA", "Crypto", "Paypal", "Skrill"] as const;
type Method = typeof METHODS[number];   // "all" | "Cards" | ...

export default function CompareFilters({ total, filteredCount, onChange }: Props) {
  const initial = useMemo(() => parseHash(), []);
  const [license, setLicense] = useState<License>(initial.license);
  const [method, setMethod] = useState<Method>(initial.method);

  // Внешние изменения hash
  useEffect(() => {
    const onHashChange = () => {
      const s = parseHash();
      setLicense(s.license);
      setMethod(s.method);
      onChange?.({ license: s.license, method: s.method });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [onChange]);

  // Локальная смена
  const applyFilters = (nextLicense: License, nextMethod: Method) => {
    setLicense(nextLicense);
    setMethod(nextMethod);

    writeHash({ license: nextLicense, method: nextMethod });
    onChange?.({ license: nextLicense, method: nextMethod });

    track("filter_apply", {
      license: nextLicense,
      method: nextMethod,
      filteredCount,
      total,
    });
  };

  const reset = () => applyFilters("all", "all");

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
     <label className="flex flex-col">
  <span className="text-sm text-gray-600 mb-1">Лицензия</span>
  <select
    className="border rounded-xl px-3 py-2 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
    value={license}
    onChange={(e) => applyFilters(e.target.value as License, method)}
    aria-label="Фильтр по лицензии"
  >
    {LICENSES.map((l) => (
      <option key={l} value={l}>
        {l === "all" ? "Все" : l}
      </option>
    ))}
  </select>
</label>

<label className="flex flex-col">
  <span className="text-sm text-gray-600 mb-1">Метод выплат</span>
  <select
    className="border rounded-xl px-3 py-2 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
    value={method}
    onChange={(e) => applyFilters(license, e.target.value as Method)}
    aria-label="Фильтр по методу выплат"
  >
    {METHODS.map((m) => (
      <option key={m} value={m}>
        {m === "all" ? "Все" : m}
      </option>
    ))}
  </select>
</label>
      {(license !== "all" || method !== "all") && (
        <button type="button" onClick={reset} className="ml-auto text-sm underline">
          Сбросить
        </button>
      )}

      <div className="text-sm text-gray-700 ml-auto">
        Показано: <strong>{filteredCount}</strong> из {total}
      </div>
    </div>
  );
}