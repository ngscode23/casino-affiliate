import { useState } from "react";
import { casinos } from "../data/casinos";

export default function HomeHero() {
  const [q, setQ] = useState("");
  const total = casinos.length;
  const fastPayouts = casinos.filter(c => (c.payoutHours ?? 999) <= 24).length;
  const withMGA = casinos.filter(c => c.license === "MGA").length;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-6">
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Найди лучшее онлайн-казино под твои критерии
        </h1>
        <p className="mt-3 text-slate-600">
          Сравнение лицензий, скорости выплат и методов. Без маркетинговой мишуры.
        </p>

        <div className="mt-6 flex gap-3 flex-wrap">
          <Stat label="Казино в базе" value={total} />
          <Stat label="Выплата ≤ 24ч" value={fastPayouts} />
          <Stat label="Лицензия MGA" value={withMGA} />
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по названию, методу, лицензии…"
              className="w-full bg-transparent px-3 py-2 outline-none text-slate-900"
              aria-label="Поиск"
            />
            <a
              href={`#/compare?sort=rating&dir=desc&license=all&method=all&search=${encodeURIComponent(q)}`}
              className="rounded-lg bg-brand-600 px-4 py-2 text-white font-semibold hover:bg-brand-700"
            >
              Найти
            </a>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Или <a href="#/compare" className="text-brand-700 font-medium">открой сравнение</a> и отфильтруй вручную.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm">
      <span className="inline-flex h-2 w-2 rounded-full bg-brand-500" />
      <span className="text-slate-600">{label}:</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}