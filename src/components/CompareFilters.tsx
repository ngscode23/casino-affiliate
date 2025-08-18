import { useEffect, useMemo, useState } from "react";
import { parseHash, writeHash, type LicenseFilter, type MethodFilter } from "../lib/hashState";
import { track } from "../lib/analytics";

type Props = {
  total: number;
  filteredCount: number;
  onChange?: (s: { license: LicenseFilter; method: MethodFilter }) => void;
};

const LICENSES = ["all", "MGA", "Curaçao", "UKGC", "Other"] as const;
type License = (typeof LICENSES)[number];

const METHODS = ["all", "Cards", "SEPA", "Crypto", "Paypal", "Skrill"] as const;
type Method = (typeof METHODS)[number];

export default function CompareFilters({ total, filteredCount, onChange }: Props) {
  const initial = useMemo(() => parseHash(), []);
  const [license, setLicense] = useState<License>(initial.license);
  const [method, setMethod] = useState<Method>(initial.method);

  // Подхватываем внешние изменения hash
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

  // Применение локальных изменений
  const applyFilters = (nextLicense: License, nextMethod: Method) => {
    setLicense(nextLicense);
    setMethod(nextMethod);
    writeHash({ license: nextLicense, method: nextMethod });
    onChange?.({ license: nextLicense, method: nextMethod });
    track("filter_apply", { license: nextLicense, method: nextMethod, filteredCount, total });
  };

  const reset = () => applyFilters("all", "all");

  return (
    <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4 text-gray-100 shadow">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col">
          <span className="mb-1 text-sm text-gray-300">Лицензия</span>
          <select
            className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500"
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
          <span className="mb-1 text-sm text-gray-300">Метод выплат</span>
          <select
            className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500"
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
          <button
            type="button"
            onClick={reset}
            className="ml-auto rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            Сбросить
          </button>
        )}

        <div className="ml-auto text-sm text-gray-400">
          Показано: <strong className="text-gray-100">{filteredCount}</strong> из {total}
        </div>
      </div>
    </div>
  );
}