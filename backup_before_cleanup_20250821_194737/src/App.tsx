// src/App.tsx
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";

import { CompareProvider } from "@/ctx/CompareContext";
import CompareBar from "@/components/CompareBar";
import Skeleton from "@/components/ui/skeleton";

// ленивые импорты
const Header        = lazy(() => import("./components/Header"));
const Footer        = lazy(() => import("./components/Footer"));
const CookieBar     = lazy(() => import("./components/CookieBar"));
const HomePage      = lazy(() => import("./pages/Home"));
const ComparePage   = lazy(() => import("./pages/Compare"));
const FavoritesPage = lazy(() => import("./pages/Favorites"));
const OfferPage     = lazy(() => import("./pages/Offer"));
const NotFound      = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="neon-container py-8 space-y-4">
            <div className="neon-card p-4 space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        }
      >
        <CompareProvider>
          <Header />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/offers/:slug" element={<OfferPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* глобальная панель сравнения */}
          <CompareBar />

          <Footer />
          <CookieBar />
        </CompareProvider>
      </Suspense>
    </div>
  );
}