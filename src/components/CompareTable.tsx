// src/components/CompareTable.tsx

import { Link } from "react-router-dom";
import Button from "@/components/ui/button";
import Rating from "@/components/ui/rating";
import Card from "@/components/ui/card";
import Table, { type Column } from "@/components/ui/table";
import type { Offer } from "@/types/offer";
import { useCompare } from "@/ctx/CompareContext";
import { FavControl } from "@/components/FavControl";
// Ключи сортировки, которые реально используются в таблице
export type SortKey = "rating" | "payoutHours";

type Props = {
  offers: Offer[];
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSortChange: (key: SortKey, dir: "asc" | "desc") => void;
};

export default function CompareTable({
  offers,
  sortKey,
  sortDir,
  onSortChange,
}: {
  offers: Offer[];
  sortKey: "rating" | "payoutHours";
  sortDir: "asc" | "desc";
  onSortChange: (k: "rating" | "payoutHours", dir: "asc" | "desc") => void;
}) {
  const { isSelected, toggle } = useCompare();

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortKey === "rating") {
      return sortDir === "asc" ? a.rating - b.rating : b.rating - a.rating;
    }
    const av = a.payoutHours ?? 0;
    const bv = b.payoutHours ?? 0;
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const ratingArrow = sortKey === "rating" ? (sortDir === "asc" ? " ▲" : " ▼") : "";
  const payoutArrow = sortKey === "payoutHours" ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const sortNext = (key: "rating" | "payoutHours") => {
    const nextDir = sortKey === key ? (sortDir === "asc" ? "desc" : "asc") : "desc";
    onSortChange(key, nextDir);
  };

  const columns: Column<Offer>[] = [
    {
      key: "compare",
      title: "COMPARE",
      width: 140,
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: (r) => {
        const id = r.slug ?? r.name;
        const selected = isSelected(id);
        return (
          <Button
            variant={selected ? "secondary" : "soft"}
            aria-pressed={selected}
            onClick={() => toggle(r)}
          >
            {selected ? "Selected" : "Compare"}
          </Button>
        );
      },
    },
    {
      key: "fav",
      title: "FAV",
      width: 80,
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: (r) => <FavControl id={r.slug ?? r.name} />,
    },
    {
      key: "name",
      title: "FIRM",
      width: 260,
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: (r) => (
        <div className="font-semibold">
          <Link
            className="hover:underline cursor-pointer"
            to={`/offers/${encodeURIComponent(r.slug ?? r.name.toLowerCase().replace(/\s+/g, "-"))}`}
          >
            {r.name}
          </Link>
        </div>
      ),
    },
    {
      key: "rating",
      title: `RATING${ratingArrow}`,
      width: 140,
      headerProps: {
        className: "px-4 py-2 cursor-pointer select-none text-[var(--muted)] hover:text-[var(--text)]",
        onClick: () => sortNext("rating"),
      },
      cellProps: { className: "px-4 py-3" },
      render: (r) => <Rating value={r.rating} />,
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
        className: "px-4 py-2 cursor-pointer select-none text-[var(--muted)] hover:text-[var(--text)]",
        onClick: () => sortNext("payoutHours"),
      },
      cellProps: { className: "px-4 py-3" },
      render: (r) => <span>{r.payout}</span>,
    },
    {
      key: "methods",
      title: "METHODS",
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: (r) => {
        const list = r.methods ?? r.payments ?? [];
        return (
          <div className="flex flex-wrap gap-2">
            {list.length ? list.map((m, i) => (
              <span key={`${m}-${i}`} className="neon-chip">{m}</span>
            )) : "—"}
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
      render: (r) => (
        <Button aria-label={`Open ${r.name}`} className="cursor-pointer">
          <a href={r.link ?? "#"}>Play</a>
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-0 hidden md:block">
      <div className="overflow-x-auto">
        <Table columns={columns} rows={sortedOffers} rowKey={(r) => r.slug ?? r.name} />
      </div>
    </Card>
  );
}

