import React, { useEffect, useMemo, useState } from "react";

type Offer = {
  name: string;
  rating: number;
  license: string;
  payout: string;
  methods: string;
  link: string;
  enabled: boolean;
  position: number;
};
/** ====== ГЛАВНЫЙ КОМПОНЕНТ ====== */
export default function App() {
  const [route, setRoute] = useState("/");
  const [ageOk, setAgeOk] = useState(false);
  const [cookiesOk, setCookiesOk] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("age_ok_v1")) setAgeOk(true);
    if (localStorage.getItem("cookies_ok_v1")) setCookiesOk(true);

    const onHash = () => setRoute(location.hash.replace("#", "") || "/");
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
      {!ageOk && <AgeGate onAccept={() => { setAgeOk(true); localStorage.setItem("age_ok_v1","1"); }} />}
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-20">{Page}</main>
      <Footer />
      {!cookiesOk && <CookieBar onAccept={() => { setCookiesOk(true); localStorage.setItem("cookies_ok_v1","1"); }} />}
    </div>
  );
}

/** ====== СТРАНИЦЫ ====== */
function Home() {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [texts, setTexts] = React.useState<{ badge: string; title: string; subtitle: string } | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    // грузим офферы
    fetch("/content/offers.json")
      .then(r => {
        if (!r.ok) throw new Error("offers.json " + r.status);
        return r.json();
      })
      .then(d => {
        const items = (d.items as Offer[])
          .filter(o => o.enabled)
          .sort((a, b) => a.position - b.position);
        setOffers(items);
      })
      .catch(e => setErr("Не удалось загрузить офферы: " + e.message));

    // грузим тексты
    fetch("/content/home.json")
      .then(r => {
        if (!r.ok) throw new Error("home.json " + r.status);
        return r.json();
      })
      .then(setTexts)
      .catch(e => setErr("Не удалось загрузить тексты: " + e.message));
  }, []);

  if (err) {
    return (
      <section className="rounded-2xl border border-rose-800 bg-rose-950/40 p-6">
        <h2 className="text-xl font-bold">Ошибка</h2>
        <p className="text-sm text-rose-300 mt-2">{err}</p>
        <p className="text-xs text-slate-400 mt-1">Проверь, что файлы лежат в <code>/public/content/</code> и пути в fetch начинаются с <code>/content/...</code>.</p>
      </section>
    );
  }

  if (!texts) return null;

  return (
    <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-sky-900/20 to-slate-900 p-6">
      <p className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
        {texts.badge}
      </p>
      <h1 className="mt-3 text-3xl font-extrabold">{texts.title}</h1>
      <p className="mt-2 text-slate-300">{texts.subtitle}</p>

      <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {offers.map(o => (
          <CasinoCard
            key={o.name}
            name={o.name}
            rating={o.rating}
            license={o.license}
            payout={o.payout}
            methods={o.methods}
            link={o.link}
          />
        ))}
      </ul>
    </section>
  );
}

function Compare() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">Сравнение</h2>
      <p className="text-slate-300">Тут будет таблица сравнения. Позже заполним.</p>
    </section>
  );
}

function Guides() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">Гайды</h2>
      <p className="text-slate-300">Пара статей для новичков. Заполним позже.</p>
    </section>
  );
}

function Responsible() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">Ответственная игра</h2>
      <p className="text-slate-300">Игра связана с рисками. 18+. Держите лимиты.</p>
    </section>
  );
}

/** ====== UI КОМПОНЕНТЫ ====== */
function Header() {
  const [open, setOpen] = useState(false);
  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60 hover:text-white">
      {children}
    </a>
  );
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#/" className="text-sm font-black uppercase tracking-wide text-slate-200">Casino Watch</a>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="#/compare">Сравнение</NavLink>
          <NavLink href="#/guides">Гайды</NavLink>
          <NavLink href="#/responsible">Ответственная игра</NavLink>
        </nav>
        <button onClick={() => setOpen(v => !v)} className="rounded-lg p-2 hover:bg-slate-800/60 md:hidden" aria-label="Меню">≡</button>
      </div>
      {open && (
        <div className="border-t border-slate-800/80 md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-2 grid gap-1">
            <a onClick={()=>setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-800/60" href="#/compare">Сравнение</a>
            <a onClick={()=>setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-800/60" href="#/guides">Гайды</a>
            <a onClick={()=>setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-800/60" href="#/responsible">Ответственная игра</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-400">© 2025 Casino Watch · 18+</div>
    </footer>
  );
}

function CasinoCard({ name, rating, license, payout, methods, link }: {
  name: string; rating: number; license: string; payout: string; methods: string; link: string;
}) {
  return (
    <li className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">{name}</div>
        <div className="text-sm text-amber-300">★ {rating}</div>
      </div>
      <ul className="mt-2 grid gap-1 text-sm text-slate-300">
        <li>Лицензия: {license}</li>
        <li>Выплаты: {payout}</li>
        <li>Методы: {methods}</li>
      </ul>
      <div className="mt-3 flex gap-2">
        <a href={link} target="_blank" rel="noreferrer nofollow"
           className="inline-flex flex-1 items-center justify-center rounded-xl bg-sky-400 px-4 py-2 font-semibold text-slate-900 hover:brightness-95">
          Перейти на сайт
        </a>
        <a href="#/compare" className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">
          Обзор
        </a>
      </div>
      <p className="mt-2 text-xs text-slate-500">Партнёрская ссылка. Условия уточняйте у оператора.</p>
    </li>
  );
}

function AgeGate({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/90 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h2 className="text-xl font-bold">Вам уже есть 18 лет?</h2>
        <p className="mt-2 text-sm text-slate-400">Сайт содержит информацию о ставках. Мы не обещаем выигрышей. Играйте ответственно.</p>
        <div className="mt-4 flex gap-2">
          <a className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
             href="https://www.begambleaware.org" target="_blank" rel="noreferrer">Мне нет 18</a>
          <button onClick={onAccept}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:brightness-95">
            Да, мне 18+
          </button>
        </div>
      </div>
    </div>
  );
}

function CookieBar({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-5xl rounded-t-2xl border border-slate-800 bg-slate-900/95 p-4 text-sm shadow-2xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-slate-300">Мы используем cookie для аналитики. Продолжая пользоваться сайтом, вы соглашаетесь.</p>
        <button onClick={onAccept} className="rounded-xl bg-slate-800 px-4 py-2 font-semibold hover:bg-slate-700">Принять</button>
      </div>
    </div>
  );
}