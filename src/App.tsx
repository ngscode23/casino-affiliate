// src/App.tsx
import "./index.css";
import "./styles/App.css"; // убери эту строку, если файла нет
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { CompareProvider } from "@/ctx/CompareContext";
import CompareBar from "@/components/CompareBar";
import Skeleton from "@/components/ui/skeleton";

import AuthCallback from "@/pages/AuthCallback";





// ленивые импорты
const Header        = lazy(() => import("./components/Header"));
const Footer        = lazy(() => import("./components/Footer"));
const CookieBar     = lazy(() => import("./components/CookieBar"));
const HomePage      = lazy(() => import("./pages/Home"));
const ComparePage   = lazy(() => import("./pages/Compare"));
const FavoritesPage = lazy(() => import("./pages/Favorites"));
const OfferPage     = lazy(() => import("./pages/Offer"));
const NotFound      = lazy(() => import("./pages/NotFound"));
const DebugSupabase = lazy(() => import("./pages/DebugSupabase"));

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
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route path="*" element={<NotFound />} />
</Routes>

          <CompareBar />
          <Footer />
          <CookieBar />
        </CompareProvider>
      </Suspense>
    </div>
  );
}