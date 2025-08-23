// src/App.tsx
import "./index.css";
// import "./styles/App.css"; // подключай только если файл реально есть

import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import { CompareProvider } from "@/ctx/CompareContext";
import CompareBar from "@/components/CompareBar";
import Skeleton from "@/components/ui/skeleton";

// GA (включается через согласие в CookieBar)
import AnalyticsGateGA from "@/components/AnalyticsGateGA";

// ленивые импорты
const Header       = lazy(() => import("./components/Header"));
const Footer       = lazy(() => import("./components/Footer"));
const CookieBar    = lazy(() => import("./components/CookieBar"));
const HomePage     = lazy(() => import("./pages/Home"));
const ComparePage  = lazy(() => import("./pages/Compare"));
const FavoritesPage= lazy(() => import("./pages/Favorites"));
const OfferPage    = lazy(() => import("./pages/Offer"));
const NotFound     = lazy(() => import("./pages/NotFound"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));

const OffersIndex  = lazy(() => import("./pages/Offers/Index"));
const ContactPage  = lazy(() => import("./pages/Contact/Contact"));
const PrivacyPage  = lazy(() => import("./pages/Legal/Privacy"));
const TermsPage    = lazy(() => import("./pages/Legal/Terms"));
const CookiesPage  = lazy(() => import("./pages/Legal/Cookies"));

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
          {/* GA подключится только при наличии cookie-согласия */}
          <AnalyticsGateGA />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/offers" element={<OffersIndex />} />
            <Route path="/offers/:slug" element={<OfferPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Legal */}
            <Route path="/legal/privacy" element={<PrivacyPage />} />
            <Route path="/legal/terms"   element={<TermsPage />} />
            <Route path="/legal/cookies" element={<CookiesPage />} />

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