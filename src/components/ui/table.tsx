import type { HTMLAttributes, ReactNode } from "react";

export type Column<T> = {
  key: keyof T | string;
  title: ReactNode;
  width?: number;
  headerProps?: HTMLAttributes<HTMLTableCellElement>;
  cellProps?: HTMLAttributes<HTMLTableCellElement>;
  render?: (row: T) => ReactNode;
};

export type TableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  className?: string;
};

export default function Table<T>({ columns, rows, rowKey, className = "" }: TableProps<T>) {
  return (
    <table className={`neon-table w-full ${className}`}>
      <colgroup>
        {columns.map((c, i) => (
          <col key={String(c.key) + i} style={{ width: c.width ? `${c.width}px` : undefined }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={String(c.key) + i} {...c.headerProps}>
              {c.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={rowKey(r, i)}>
            {columns.map((c, j) => (
              <td key={String(c.key) + j} {...c.cellProps}>
                {c.render ? c.render(r) : (r as any)[c.key as keyof T]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}