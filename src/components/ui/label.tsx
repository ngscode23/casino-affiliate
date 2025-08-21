// src/ui/Table.tsx
import React from "react";

export type Column<T> = {
  key: keyof T | string;
  title: React.ReactNode;
  width?: number;
  // 👇 Эти два поля важны для кликабельных заголовков/клеток
  headerProps?: React.ThHTMLAttributes<HTMLTableCellElement>;
  cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  /** Стабильный ключ, чтобы React реально переставлял строки при смене сортировки */
  rowKey?: (row: T, index: number) => React.Key;
  className?: string;
};

export default function Table<T>({ columns, rows, rowKey, className }: Props<T>) {
  return (
    <div className={className}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-[var(--muted)]">
            {columns.map((c, i) => (
              <th
                key={i}
                style={c.width ? { width: c.width } : undefined}
                className="px-4 py-2"
                {...(c.headerProps ?? {})}
              >
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={rowKey ? rowKey(row, ri) : ri}
              className="border-t border-white/10 hover:bg-white/5 transition-colors"
            >
              {columns.map((c, ci) => (
                <td key={ci} className="px-4 py-3" {...(c.cellProps ?? {})}>
                  {c.render ? c.render(row) : (row as any)[c.key as any]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}