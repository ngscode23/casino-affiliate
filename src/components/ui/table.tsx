// src/ui/Table.tsx
import type {
  CSSProperties,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";

export type Column<T> = {
  /** ключ поля или произвольный ключ */
  key: keyof T | string;
  /** заголовок колонки (текст) */
  title: string;
  /** фиксированная ширина (опционально) */
  width?: number | string;
  /** рендер ячейки строки */
  render?: (row: T, rowIndex: number) => React.ReactNode;
  /** пропсы для <th> этой колонки */
  headerProps?: ThHTMLAttributes<HTMLTableCellElement>;
  /** пропсы для <td> каждой ячейки этой колонки */
  cellProps?: TdHTMLAttributes<HTMLTableCellElement>;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  className?: string;
  /** ключ строки (по умолчанию индекс) */
  rowKey?: (row: T, index: number) => string | number;
  /** что показать, когда нет данных */
  emptyText?: string;
  /** инлайн-стили для <table> */
  style?: CSSProperties;
};

export default function Table<T>({
  columns,
  rows,
  className = "neon-table w-full border-collapse",
  rowKey = (_row, i) => i,
  emptyText = "No data",
  style,
}: Props<T>) {
  // если нет конфигурации — подсказываем разработчику
  if (!columns?.length) {
    return (
      <div style={{ padding: 16 }}>
        <div className="neon-card" style={{ padding: 16 }}>
          <div className="neon-subline">No columns configured</div>
        </div>
      </div>
    );
  }

  return (
    <table className={className} style={style}>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th
              key={String(c.key) + "_" + i}
              style={c.width ? { width: c.width } : undefined}
              {...c.headerProps}
              className={`px-4 py-2 ${c.headerProps?.className ?? ""}`}
            >
              {c.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-4 py-3 text-[var(--text-dim)]"
            >
              {emptyText}
            </td>
          </tr>
        ) : (
          rows.map((r, ri) => (
            <tr key={rowKey(r, ri)} className="border-b border-white/5">
              {columns.map((c, ci) => {
                const content =
                  c.render != null
                    ? c.render(r, ri)
                    : // если render не задан, пробуем отдать простое значение по ключу
                      (r as any)[c.key as keyof T];

                return (
                  <td
                    key={String(c.key) + "_" + ci}
                    {...c.cellProps}
                    className={`px-4 py-3 ${c.cellProps?.className ?? ""}`}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
















