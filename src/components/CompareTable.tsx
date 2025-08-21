import Table from "../ui/Table";
import type { Column } from "../ui/Table";
import Rating from "../ui/Rating";
import { Button } from "@/components/ui/button";
import Card from "../ui/Card";
import MobileOfferCard from "./MobileOfferCard";
import { Link } from "react-router-dom";

// ✱ ДОБАВИЛИ ключи "license" и "methodsCount"
export type SortKey = "rating" | "payoutHours" | "license" | "methodsCount";

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
  // стрелочки в заголовках
  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  const sortNext = (key: SortKey) => {
    const nextDir: "asc" | "desc" =
      sortKey === key && sortDir === "asc" ? "desc" : "asc";
    onSortChange(key, nextDir);
  };

  const methodsCount = (o: Offer) =>
    (o.methods?.length ?? 0) || (o.payments?.length ?? 0);

  // ФАКТИЧЕСКАЯ СОРТИРОВКА
  const sortedOffers = [...offers].sort((a, b) => {
    switch (sortKey) {
      case "rating": {
        return sortDir === "asc" ? a.rating - b.rating : b.rating - a.rating;
      }
      case "payoutHours": {
        const av = a.payoutHours ?? 0;
        const bv = b.payoutHours ?? 0;
        return sortDir === "asc" ? av - bv : bv - av;
      }
      case "license": {
        const la = (a.license ?? "").toString().toLowerCase();
        const lb = (b.license ?? "").toString().toLowerCase();
        const cmp = la.localeCompare(lb);
        return sortDir === "asc" ? cmp : -cmp;
      }
      case "methodsCount": {
        const ac = methodsCount(a);
        const bc = methodsCount(b);
        return sortDir === "asc" ? ac - bc : bc - ac;
      }
      default:
        return 0;
    }
  });

  const columns: Column<Offer>[] = [
    {
      key: "name",
      title: "FIRM",
      width: 260,
      headerProps: { className: "px-4 py-2" },
      cellProps: { className: "px-4 py-3" },
      render: (r) => (
        <div className="font-semibold">
          <Link
            to={`/offers/${encodeURIComponent(
              r.slug ?? r.name.toLowerCase().replace(/\s+/g, "-")
            )}`}
          >
            {r.name}
          </Link>
        </div>
      ),
    },
    {
      key: "rating",
      title: `RATING${arrow("rating")}`,
      width: 140,
      headerProps: {
        className:
          "px-4 py-2 cursor-pointer select-none text-[var(--muted)] hover:text-[var(--text)]",
        onClick: () => sortNext("rating"),
      },
      cellProps: { className: "px-4 py-3" },
      render: (r) => <Rating value={r.rating} />,
    },
    {
      key: "license",
      // ✱ КЛИКАБЕЛЬНЫЙ заголовок + стрелка
      title: `LICENSE${arrow("license")}`,
      width: 140,
      headerProps: {
        className:
          "px-4 py-2 cursor-pointer select-none text-[var(--muted)] hover:text-[var(--text)]",
        onClick: () => sortNext("license"),
      },
      cellProps: { className: "px-4 py-3 text-[var(--text-dim)]" },
    },
    {
      key: "payout",
      title: `PAYOUT${arrow("payoutHours")}`,
      width: 160,
      headerProps: {
        className:
          "px-4 py-2 cursor-pointer select-none text-[var(--muted)] hover:text-[var(--text)]",
        onClick: () => sortNext("payoutHours"),
      },
      cellProps: { className: "px-4 py-3" },
      render: (r) => <span>{r.payout}</span>,
    },
    {
      key: "methods",
      // ✱ Сортируем по КОЛИЧЕСТВУ методов оплаты
      title: `METHODS${arrow("methodsCount")}`,
      headerProps: {
        className:
          "px-4 py-2 cursor-pointer select-none text-[var(--muted)] hover:text-[var(--text)]",
        onClick: () => sortNext("methodsCount"),
      },
      cellProps: { className: "px-4 py-3" },
      render: (r) => {
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
      render: (r) => (
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
        <Table
          columns={columns}
          rows={sortedOffers}
          rowKey={(r) => r.slug ?? r.name}
        />
      </Card>
    </>
  );
}