import Table from "../ui/Table";
import type { Column } from "../ui/Table";
import Rating from "../ui/Rating";
import Button from "../ui/Button";
import Card from "../ui/Card";

export type Offer = {
  slug?: string;
  name: string;
  rating: number;
  license: "MGA" | "Curaçao" | "UKGC" | "Other" | string;
  payout: string;
  payoutHours?: number;
  methods?: string[];   // ← добавили
  payments?: string[];  // ← совместимость
  link?: string;
};

type Props = {
  offers: Offer[];
  sortKey: string;
  sortDir: "asc" | "desc";
  onSortChange: (key: "rating" | "payoutHours" | string, dir: "asc" | "desc") => void; // ← расширили
};

function header(label: string, key: "rating" | "payoutHours" | string, sortKey: string, dir: "asc" | "desc", onSort: Props["onSortChange"]) {
  const is = sortKey === key;
  const arrow = is ? (dir === "asc" ? "↑" : "↓") : "";
  return (
    <button className="text-left text-[var(--muted)] hover:text-[var(--text)]"
            onClick={() => onSort(key, is && dir === "asc" ? "desc" : "asc")}>
      {label} {arrow}
    </button>
  );
}

export default function CompareTable({ offers, sortKey, sortDir, onSortChange }: Props) {
  const columns: Column<Offer>[] = [
    { key: "name", title: "FIRM", render: (r) => (
        <div className="flex items-center gap-3">
          <div className="neon-chip">{r.name?.[0] ?? "?"}</div>
          <div className="font-semibold">{r.name}</div>
        </div>
      ) },
    { key: "rating", title: header("RATING", "rating", sortKey, sortDir, onSortChange), render: (r) => <Rating value={r.rating} />, width: 140 },
    { key: "license", title: "LICENSE", width: 140 },
    { key: "payout", title: header("PAYOUT", "payoutHours", sortKey, sortDir, onSortChange), render: (r) => <span>{r.payout}</span>, width: 160 },
    { key: "methods", title: "METHODS", render: (r) => {
        const list = r.methods ?? r.payments ?? [];
        return <div className="flex flex-wrap gap-2">{list.map((m, i) => <span key={i} className="neon-chip">{m}</span>)}</div>;
      } },
    { key: "link", title: "ACTION", render: (r) => <a href={r.link ?? "#"}><Button>Play</Button></a>, width: 140 },
  ];

  return <Card className="p-0"><Table columns={columns} rows={offers} /></Card>;
}