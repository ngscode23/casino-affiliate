// src/components/compare/CompareTable.tsx
import { Link } from "react-router-dom";

import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Rating from "@/components/common/rating";
import Table, { type Column } from "@/components/common/table";

import { useCompare } from "@/ctx/CompareContext";
import FavControl from "@/components/FavControl";

import type { NormalizedOffer } from "@/lib/offers";

export type SortKey = "rating" | "payoutHours";

type Props = {
  offers: NormalizedOffer[];
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSortChange: (key: SortKey, dir: "asc" | "desc") => void;
};

export default function CompareTable({ offers, sortKey, sortDir, onSortChange }: Props) {
  const { isSelected, toggle } = useCompare();

  const sorted = [...offers].sort((a, b) => {
    if (sortKey === "rating") {
      const av = a.rating ?? 0;
      const bv = b.rating ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    }
    const av = a.payoutHours ?? Number.POSITIVE_INFINITY;
    const bv = b.payoutHours ?? Number.POSITIVE_INFINITY;
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const ratingArrow = sortKey === "rating" ? (sortDir === "asc" ? " ▲" : " ▼") : "";
  const payoutArrow = sortKey === "payoutHours" ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const sortNext = (key: SortKey) => {
    const nextDir: "asc" | "desc" = sortKey === key ? (sortDir === "asc" ? "desc" : "asc") : "desc";
    onSortChange(key, nextDir);
  };

  // Table expects Column<unknown>[], so keep that and cast inside render
  const columns: Column<unknown>[] = [
    {
      key: "compare",
      title: "COMPARE",
      width: 140,
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: (r: unknown) => {
        const row = r as NormalizedOffer;
        if (!row.slug) return null;
        const selected = isSelected(row.slug);
        return (
          <Button
            variant={selected ? "secondary" : "soft"}
            aria-pressed={selected}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(row);
            }}
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
      render: (r: unknown) => {
        const row = r as NormalizedOffer;
        return row.slug ? <FavControl id={row.slug} className="inline-flex h-10 w-10 items-center justify-center" /> : null;
      },
    },

    {
      key: "name",
      title: "FIRM",
      width: 260,
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: (r: unknown) => {
        const row = r as NormalizedOffer;
        return (
          <div className="font-semibold">
            <Link
              className="hover:underline cursor-pointer"
              to={`/offers/${encodeURIComponent(row.slug ?? row.name.toLowerCase().replace(/\s+/g, "-"))}`}
            >
              {row.name}
            </Link>
          </div>
        );
      },
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
      render: (r: unknown) => <Rating value={(r as NormalizedOffer).rating ?? 0} />,
    },

    {
      key: "license",
      title: "LICENSE",
      width: 140,
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3 text-[var(--text-dim)]" },
      render: (r: unknown) => <span>{(r as NormalizedOffer).license ?? "—"}</span>,
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
      render: (r: unknown) => <span>{(r as NormalizedOffer).payout ?? "—"}</span>,
    },

    {
      key: "methods",
      title: "METHODS",
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: (r: unknown) => {
        const row = r as NormalizedOffer;
        const list = row.methods ?? [];
        return (
          <div className="flex flex-wrap gap-2">
            {list.length ? list.map((m, i) => <span key={`${m}-${i}`} className="neon-chip">{m}</span>) : "—"}
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
      render: (r: unknown) => {
        const row = r as NormalizedOffer;
        return (
          <a
            href={row.link ?? "#"}
            className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium transition"
            aria-label={`Open ${row.name}`}
          >
            Play
          </a>
        );
      },
    },
  ];

  return (
    <Card className="p-0 hidden md:block">
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          rows={sorted}
          rowKey={(r: unknown) => {
            const row = r as NormalizedOffer;
            return row.slug ?? row.name;
          }}
        />
      </div>
    </Card>
  );
}
