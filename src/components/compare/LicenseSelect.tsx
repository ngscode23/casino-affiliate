// src/components/compare/LicenseSelect.tsx
import { track } from "@/lib/analytics";

// Если тип уже экспортируется из CompareFilters — УДАЛИ это определение и импортни тип оттуда.
// export type LicenseFilter = "all" | "MGA" | "UKGC" | "Curaçao";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  value: "all" | "MGA" | "UKGC" | "Curaçao"; // <-- Используй один источник истины по типу
  onChange: (v: "all" | "MGA" | "UKGC" | "Curaçao") => void;
  id?: string;
  name?: string;
  className?: string;
};

export function LicenseSelect({
  value,
  onChange,
  id = "license",
  name = "license",
  className = "form-select", // tailwind-утилиты, свои добавь по вкусу
  ...rest
}: Props) {
  return (
    <select
      id={id}
      name={name}
      aria-label="License"
      value={value}
      onChange={(e) => {
        const val = e.target.value as Props["value"];
        if (val === value) return; // не спамим дубль-события
        onChange(val);
        track({ name: "toggle_filter", params: { filter: "license", value: val } });
      }}
      className={className}
      {...rest}
    >
      <option value="all">All</option>
      <option value="MGA">MGA</option>
      <option value="UKGC">UKGC</option>
      <option value="Curaçao">Curaçao</option>
    </select>
  );
}

export default LicenseSelect;

