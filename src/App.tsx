// src/App.tsx
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";

import { CompareProvider } from "@/ctx/CompareContext";
import CompareBar from "@/components/CompareBar";
import type { SortKey } from "@/components/CompareTable";



// ленивые импорты
const Header      = lazy(() => import("./components/Header"));
const Footer      = lazy(() => import("./components/Footer"));
const CookieBar   = lazy(() => import("./components/CookieBar"));
const FavoritesPage = lazy(() => import("./pages/Favorites"));
const HomePage    = lazy(() => import("./pages/Home"));
const ComparePage = lazy(() => import("./pages/Compare"));
const OfferPage   = lazy(() => import("./pages/Offer"));
const NotFound    = lazy(() => import("./pages/NotFound"));

// если захочешь AgeGate — раскомментируй следующие 2 строки:
// const AgeGate     = lazy(() => import("./components/AgeGate"));
// const SHOW_AGE_GATE = false;

export default function App() {
  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="neon-container py-8" style={{ color: "var(--text-dim)" }}>
            Загрузка…
          </div>
        }
      >
        <CompareProvider>
          {/* {SHOW_AGE_GATE && <AgeGate />} */}
          <Header />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/offers/:slug" element={<OfferPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Глобальная панель сравнения (покажется, когда выбрано ≥2 офферов) */}
          <CompareBar />

          <Footer />
          <CookieBar />
        </CompareProvider>
      </Suspense>
    </div>
  );
}