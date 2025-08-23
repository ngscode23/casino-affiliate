// src/components/compare/LicenseSelect.tsx
import { track } from "@/lib/analytics";

export type LicenseFilter = "all" | "MGA" | "UKGC" | "Curaçao";

// ВАЖНО: убираем конфликт с DOM onChange / value
type Props = {
  value: LicenseFilter;
  onChange: (v: LicenseFilter) => void;
  id?: string;
  name?: string;
  className?: string;
};

export default function LicenseSelect({ value, onChange, id, name, className }: Props) {
  return (
    <select
      aria-label="License"
      id={id}
      name={name}
      className={className}
      value={value}
      onChange={(e) => {
        const val = e.target.value as LicenseFilter;
        onChange(val);
        track({ name: "toggle_filter", params: { filter: "license", value: val } });
      }}
    >
      <option value="all">All</option>
      <option value="MGA">MGA</option>
      <option value="UKGC">UKGC</option>
      <option value="Curaçao">Curaçao</option>
    </select>
  );
}