// src/components/CompareTable.tsx

import { Link } from "react-router-dom";
import Button from "@/components/ui/button";
import Rating from "@/components/ui/rating";
import Card from "@/components/ui/card";
import Table, { type Column } from "@/components/ui/table";
import type { Offer } from "@/types/offer";

// Ключи сортировки, которые реально используются в таблице
export type SortKey = "rating" | "payoutHours";

type Props = {
  offers: Offer[];
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSortChange: (key: SortKey, dir: "asc" | "desc") => void;
};

export default function CompareTable({ offers, sortKey, sortDir, onSortChange }: Props) {
  const sortNext = (key: SortKey) => {
    const nextDir: "asc" | "desc" = sortKey === key ? (sortDir === "asc" ? "desc" : "asc") : "desc";
    onSortChange(key, nextDir);
  };

  const ratingArrow = sortKey === "rating" ? (sortDir === "asc" ? " ▲" : " ▼") : "";
  const payoutArrow = sortKey === "payoutHours" ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortKey === "rating") {
      const av = (a.rating ?? 0);
      const bv = (b.rating ?? 0);
      return sortDir === "asc" ? av - bv : bv - av;
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
      render: r => (
        <div className="font-semibold">
          <Link
            className="hover:underline cursor-pointer"
            to={`/offers/${encodeURIComponent((r.slug ?? r.name).toLowerCase().replace(/\s+/g, "-"))}`}
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
      render: r => <Rating value={r.rating ?? 0} />,
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
      render: r => (
        <span>
          {r.payout}
          {r.payoutHours ? ` (~${r.payoutHours}h)` : ""}
        </span>
      ),
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
            {list.length
              ? list.map((m, i) => (
                  <span key={`${m}-${i}`} className="neon-chip">
                    {m}
                  </span>
                ))
              : "—"}
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
        <Button aria-label={`Open ${r.name}`} className="cursor-pointer">
          <a
            href={r.link ?? "#"}
            target={r.link?.startsWith("http") ? "_blank" : undefined}
            rel={r.link?.startsWith("http") ? "nofollow sponsored noopener" : undefined}
          >
            Play
          </a>
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-0">
      <div className="overflow-x-auto">
        <Table columns={columns} rows={sortedOffers} rowKey={r => r.slug ?? r.name} />
      </div>
    </Card>
  );
}

