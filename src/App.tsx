// src/App.tsx
import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import "./App.css";

import Header from "./components/Header";
import { Footer } from "./components/Footer";
import { AgeGate } from "./components/AgeGate";
import { CookieBar } from "./components/CookieBar";

// Все страницы — дефолтные экспорты
const Home = lazy(() => import("./pages/Home"));
const Compare = lazy(() => import("./pages/Compare"));
const Guides = lazy(() => import("./pages/Guides").then(module => ({ default: module.Guides })));
const Responsible = lazy(() =>
  import("./pages/Responsible").then(module => ({ default: module.Responsible }))
);

type Route = "/" | "/compare" | "/guides" | "/responsible";
const ALLOWED_ROUTES: Route[] = ["/", "/compare", "/guides", "/responsible"];

function getPathFromHash(): Route {
  // "#/compare?sort=rating&dir=desc" -> "/compare"
  const raw = (window.location.hash || "").replace(/^#/, "");
  const path = (raw.split("?")[0] || "/") as Route;
  return (ALLOWED_ROUTES as string[]).includes(path) ? (path as Route) : "/";
}

export default function App() {
  const [route, setRoute] = useState<Route>(getPathFromHash());
  const [ageOk, setAgeOk] = useState<boolean>(!!localStorage.getItem("age_ok_v1"));
  const [cookiesOk, setCookiesOk] = useState<boolean>(!!localStorage.getItem("cookies_ok_v1"));

  useEffect(() => {
    const onHash = () => setRoute(getPathFromHash());
    window.addEventListener("hashchange", onHash);
    // первичная синхронизация (на случай прямого входа)
    setRoute(getPathFromHash());
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const Page = useMemo(() => {
    switch (route) {
      case "/compare": return <Compare />;
      case "/guides": return <Guides />;
      case "/responsible": return <Responsible />;
      default: return <Home />;
    }
  }, [route]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <Suspense fallback={<div className="text-slate-400 p-8">Загрузка…</div>}>
        {!ageOk && (
          <AgeGate
            onAccept={() => {
              setAgeOk(true);
              localStorage.setItem("age_ok_v1", "1");
            }}
          />
        )}

        <main className="mx-auto max-w-6xl px-4 pb-16 pt-20">{Page}</main>

        <Footer />

        {!cookiesOk && (
          <CookieBar
            onAccept={() => {
              setCookiesOk(true);
              localStorage.setItem("cookies_ok_v1", "1");
            }}
          />
        )}
      </Suspense>
    </div>
  );
}