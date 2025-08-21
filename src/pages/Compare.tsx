// src/pages/Compare.tsx
import { useState } from "react";
import CompareFilters from "@/components/CompareFilters";
import CompareTable from "@/components/CompareTable";
import type { SortKey } from "@/components/CompareTable";
import { offers as allOffers } from "@/data/offers";



export default function Compare() {
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  return (
    <section className="neon-container space-y-6">
      <div className="neon-card p-4">
        <CompareFilters
          total={allOffers.length}
          filteredCount={allOffers.length}
          onChange={() => {}}
        />
      </div>

      <div className="neon-card p-0">
        <CompareTable
          offers={allOffers}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={(k, d) => { setSortKey(k); setSortDir(d); }}
        />
      </div>
    </section>
  );
}

