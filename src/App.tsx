import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";

const Header = lazy(()=>import("./components/Header"));
const Footer = lazy(()=>import("./components/Footer"));
const CookieBar = lazy(()=>import("./components/CookieBar"));
const HomePage = lazy(()=>import("./pages/Home"));
const ComparePage = lazy(()=>import("./pages/Compare"));
const OfferPage = lazy(()=>import("./pages/Offer"));
const NotFoundPage = lazy(()=>import("./pages/NotFound"));

export default function App() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="neon-container py-8" style={{ color:"var(--text-dim)"}}>Загрузка…</div>}>
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/offers/:slug" element={<OfferPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Footer />
        <CookieBar />
      </Suspense>
    </div>
  );
}