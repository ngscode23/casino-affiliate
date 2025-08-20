// src/components/CompareTable.tsx
import Table from "../ui/Table";
import type { Column } from "../ui/Table";
import Rating from "../ui/Rating";
import { Button } from "@/components/ui/button";
import Card from "../ui/Card";
import MobileOfferCard from "./MobileOfferCard"; // ← вверху файла добавь этот импорт

export type SortKey = "rating" | "payoutHours";

export type Offer = {
  slug?: string;
  name: string;
  rating: number;
  license: "MGA" | "Curaçao" | "UKGC" | "Other" | string;
  payout: string;
  payoutHours?: number;
  methods?: string[];
  payments?: string[];
  link?: string;
};

type Props = {
  offers: Offer[];
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSortChange: (key: SortKey, dir: "asc" | "desc") => void;
};

export default function CompareTable({ offers, sortKey, sortDir, onSortChange }: Props) {
  // стрелки в заголовках
  const ratingArrow = sortKey === "rating" ? (sortDir === "asc" ? " ↑" : " ↓") : "";
  const payoutArrow = sortKey === "payoutHours" ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  // переключатель направления
  const sortNext = (key: SortKey) => {
    const nextDir: "asc" | "desc" = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    onSortChange(key, nextDir);
  };

  // фактическая сортировка
  const sortedOffers = [...offers].sort((a, b) => {
    if (sortKey === "rating") {
      return sortDir === "asc" ? a.rating - b.rating : b.rating - a.rating;
    }
    const av = a.payoutHours ?? 0;
    const bv = b.payoutHours ?? 0;
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const columns: Column<Offer>[] = [
    {
      key: "name",
      title: "FIRM",
      width: 260,
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: r => <div className="font-semibold">{r.name}</div>,
    },
    {
      key: "rating",
      title: `RATING${ratingArrow}`,
      width: 140,
      headerProps: {
        className:
          "px-4 py-2 cursor-pointer select-none text-[var(--muted)] hover:text-[var(--text)]",
        onClick: () => sortNext("rating"),
      },
      cellProps: { className: "px-4 py-3" },
      render: r => <Rating value={r.rating} />,
    },
    {
      key: "license",
      title: "LICENSE",
      width: 140,
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3 text-[var(--text-dim)]" },
    },
    {
      key: "payout",
      title: `PAYOUT${payoutArrow}`,
      width: 160,
      headerProps: {
        className:
          "px-4 py-2 cursor-pointer select-none text-[var(--muted)] hover:text-[var(--text)]",
        onClick: () => sortNext("payoutHours"),
      },
      cellProps: { className: "px-4 py-3" },
      render: r => <span>{r.payout}</span>,
    },
    {
      key: "methods",
      title: "METHODS",
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: r => {
        const list = r.methods ?? r.payments ?? [];
        return (
          <div className="flex flex-wrap gap-2">
            {list.map((m, i) => (
              <span key={`${m}-${i}`} className="neon-chip">
                {m}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "link",
      title: "ACTION",
      width: 140,
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: r => (
        <Button asChild aria-label={`Open ${r.name}`}>
          <a href={r.link ?? "#"}>Play</a>
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Мобильная версия: карточки */}
   


<div className="grid gap-3 sm:gap-4 md:hidden">
  {sortedOffers.map((o) => (
    <MobileOfferCard key={o.slug ?? o.name} offer={o} />
  ))}
</div>
      {/* Десктопная версия: таблица */}
      <Card className="p-0 hidden md:block">
        <Table columns={columns} rows={sortedOffers} rowKey={r => r.slug ?? r.name} />
      </Card>
    </>
  );
}