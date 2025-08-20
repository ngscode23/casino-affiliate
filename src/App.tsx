// src/App.tsx
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// layout-блоки
const Header       = lazy(() => import("./components/Header"));
const Footer       = lazy(() => import("./components/Footer"));
const CookieBar    = lazy(() => import("./components/CookieBar"));
// страницы
const HomePage     = lazy(() => import("./pages/Home"));
const ComparePage  = lazy(() => import("./pages/Compare"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="neon-container py-8" style={{color:"var(--text-dim)"}}>Загрузка…</div>}>
        <Header />

        <main className="py-10 space-y-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        <CookieBar />
      </Suspense>
    </div>
  );
}