// src/App.tsx
import { Suspense, useState, lazy, type ComponentType } from "react";
import "./index.css"; // tailwind v4 + твоя тема

// helper для lazy
function lazyNamed(loader: () => Promise<any>, name?: string) {
  return lazy(async () => {
    const m = await loader();
    const comp = (name ? m[name] : m.default) ?? m.default;
    if (!comp) throw new Error(`Компонент ${String(name ?? "default")} не найден`);
    return { default: comp as ComponentType<any> };
  });
}

// ленивые импорты
const Header         = lazyNamed(() => import("./components/Header"), "Header");
const Footer         = lazyNamed(() => import("./components/Footer"), "Footer");
const CookieBar      = lazyNamed(() => import("./components/CookieBar"), "CookieBar");
const AgeGate        = lazyNamed(() => import("./components/AgeGate"), "AgeGate");
const CompareFilters = lazyNamed(() => import("./components/CompareFilters"), "CompareFilters");
const CompareTable   = lazyNamed(() => import("./components/CompareTable"), "CompareTable");
const RankingTable   = lazyNamed(() => import("./components/RankingTable"), "RankingTable");

// данные и тип сортировки
import { offers as initialOffers } from "./data/offers";
import type { SortKey } from "./components/CompareTable";

// флаги
const SHOW_AGE_GATE = false;
const SHOW_HERO = true;

export default function App() {
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const offers = initialOffers;

  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="neon-container py-8" style={{ color: "var(--text-dim)" }}>
            Загрузка…
          </div>
        }
      >
        {SHOW_AGE_GATE && <AgeGate />}
        <Header />

        {SHOW_HERO && (
          <section className="neon-hero">
            <div className="neon-container">
              <div className="mb-4 flex items-center gap-2">
                <span className="neon-chip" data-glow>500+ Offers</span>
                <span className="neon-chip" data-glow>Real reviews</span>
                <span className="neon-chip" data-glow>Fast payouts</span>
              </div>
            <h1 className="font-extrabold" style={{ fontSize: "clamp(22px, 6vw, 46px)" }}>
              The Leading Casino Affiliate Platform
            </h1>
              <p className="neon-subline">Compare top casinos, find exclusive bonuses, and withdraw faster.</p>
              <div className="neon-search">
                <input className="neon-input" placeholder="Search casinos, bonuses, licenses…" />
                <button className="neon-btn">Compare now</button>
              </div>
            </div>
          </section>
        )}

        <main className="py-10 space-y-10">
          <section className="neon-container">
            <div className="neon-card p-4">
              <CompareFilters
                total={offers.length}
                filteredCount={offers.length}
                onChange={() => {}}
              />
            </div>
          </section>

          <section className="neon-container">
            <div className="neon-card p-4">
              <RankingTable total={offers.length} filteredCount={offers.length} />
            </div>
          </section>

          <section className="neon-container">
            <div className="neon-card p-0">
              <CompareTable
                offers={offers}
                sortKey={sortKey}
                sortDir={sortDir}
                onSortChange={(k: SortKey, d: "asc" | "desc") => {  // ← типизировано
                  setSortKey(k);
                  setSortDir(d);
                }}
              />
            </div>
          </section>
        </main>

        <Footer />
        <CookieBar />
      </Suspense>
    </div>
  );
}