export type Column<T> = {
  key: keyof T | string;
  title: React.ReactNode;
  width?: number | string;
  render?: (row: T) => React.ReactNode;
  headerProps?: React.ThHTMLAttributes<HTMLTableCellElement>;
  cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>;
};

type Props<T> = { columns?: Column<T>[]; rows?: T[] };

export default function Table<T>(props: Props<T>) {
  const cols = Array.isArray(props.columns) ? props.columns : [];
  const data = Array.isArray(props.rows) ? props.rows : [];

  if (cols.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <div className="neon-card" style={{ padding: 16 }}>
          <div className="neon-subline">No columns configured</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <table className="neon-table">
        <thead>
          <tr>{cols.map((c, i) => <th key={i} style={{ width: c.width }} {...c.headerProps}>{c.title}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={cols.length}><div className="neon-subline">No data</div></td></tr>
          ) : (
            data.map((r, ri) => (
              <tr key={ri}>
                {cols.map((c, ci) => <td key={ci} {...c.cellProps}>{c.render ? c.render(r) : String((r as any)[c.key as any])}</td>)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}