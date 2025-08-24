// src/App.tsx
import "./index.css";

import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import { CompareProvider } from "@/ctx/CompareContext";
import CompareBar from "@/components/layout/CompareBar";
import Skeleton from "@/components/common/skeleton";
import OrgJsonLd from "@/components/OrgJsonLd"; // JSON-LD Organization — один раз на всё приложение

// ── Ленивые компоненты каркаса
const Header     = lazy(() => import("@/components/layout/Header"));
const Footer     = lazy(() => import("@/components/layout/Footer"));
const CookieBar  = lazy(() => import("@/components/layout/CookieBar"));

// ── Ленивые страницы
const HomePage       = lazy(() => import("@/pages/Home"));
const ComparePage    = lazy(() => import("@/pages/Compare"));
const FavoritesPage  = lazy(() => import("@/pages/Favorites"));
const OfferPage      = lazy(() => import("@/pages/Offer"));
const NotFound       = lazy(() => import("@/pages/NotFound"));
// const OffersIndex    = lazy(() => import("@/pages/Offers"));
const ContactPage    = lazy(() => import("@/pages/Contact"));
const PrivacyPage    = lazy(() => import("@/pages/Legal/Privacy"));
const TermsPage      = lazy(() => import("@/pages/Legal/Terms"));
const CookiesPage    = lazy(() => import("@/pages/Legal/Cookies"));
const Responsible    = lazy(() => import("@/pages/Legal/ResponsibleGaming"));
const AffiliateDisc  = lazy(() => import("@/pages/Legal/AffiliateDisclosure"));
const OffersIndex = lazy(() => import("@/pages/Offers/index"));
const AdminApp = lazy(() => import("@/pages/Admin"));
// Если админка ещё не создана — оставь закомментированным:
// const AdminApp   = lazy(() => import("@/pages/Admin"));

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text)]">
      {/* Skip link для клавиатуры */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:rounded-md focus:bg-black focus:text-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

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
          {/* Глобальная разметка Organization (JSON-LD) — один раз */}
          <OrgJsonLd />

          <main id="main" className="min-h-[60vh]">
            <Routes>
              {/* Если добавишь админку — раскомментируй */}
              {/* <Route path="/admin/*" element={<AdminApp />} /> */}



              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="*" element={<NotFound />} />

              <Route path="/" element={<HomePage />} />
              <Route path="/offers" element={<OffersIndex />} />
              <Route path="/offers/:slug" element={<OfferPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Legal */}
              <Route path="/legal/privacy" element={<PrivacyPage />} />
              <Route path="/legal/terms" element={<TermsPage />} />
              <Route path="/legal/cookies" element={<CookiesPage />} />
              <Route path="/legal/responsible" element={<Responsible />} />
              <Route path="/legal/affiliate-disclosure" element={<AffiliateDisc />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <CompareBar />
          <Footer />
          <CookieBar />
        </CompareProvider>
      </Suspense>
    </div>
  );
}