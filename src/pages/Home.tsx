import { Hero } from "../components/Hero";
import { CasinoCard } from "../components/CasinoCard";
import { casinos } from "../data/casinos";
import { Seo } from "../components/Seo";
export function Home() {
  const items = casinos
    .filter(o => o.enabled !== false)
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999));

  return (
    <>
      <Hero />
      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-bold">Топ-онлайн казино</h2>
        <p className="mt-2 text-slate-300">
          Подборка партнёрских офферов. Проверьте условия на сайте оператора.
        </p>

        <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(o => (
            <CasinoCard key={o.name} {...o} />
          ))}
        </ul>
      </section>
    </>
  );
}

