import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import "./App.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AgeGate } from "./components/AgeGate";
import { CookieBar } from "./components/CookieBar";

// Ленивая загрузка страниц (named exports → мапим на default)
const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Compare = lazy(() => import("./pages/Compare").then(m => ({ default: m.Compare })));
const Guides = lazy(() => import("./pages/Guides").then(m => ({ default: m.Guides })));
const Responsible = lazy(() => import("./pages/Responsible").then(m => ({ default: m.Responsible })));

type Route = "/" | "/compare" | "/guides" | "/responsible";

export default function App() {
  const [route, setRoute] = useState<Route>("/");
  const [ageOk, setAgeOk] = useState(false);
  const [cookiesOk, setCookiesOk] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("age_ok_v1")) setAgeOk(true);
    if (localStorage.getItem("cookies_ok_v1")) setCookiesOk(true);

    const onHash = () => {
      const r = (location.hash.replace("#", "") || "/") as Route;
      setRoute(r);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const Page = useMemo(() => {
    switch (route) {
      case "/compare":
        return <Compare />;
      case "/guides":
        return <Guides />;
      case "/responsible":
        return <Responsible />;
      default:
        return <Home />;
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