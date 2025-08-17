import { Seo } from "../components/Seo";
import { Hero } from "../components/Hero";
import { CasinoCard } from "../components/CasinoCard";
import { casinos } from "../data/casinos";

export function Home() {
  const items = casinos
    .filter(o => o.enabled !== false)
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
    <>
      <Seo 
        title="Casino Watch — Топ онлайн-казино 2025" 
        description="Рейтинг лучших онлайн-казино с бонусами и проверенной репутацией. Играй ответственно, 18+." 
      />
      <h1 className="text-3xl font-bold">Главная</h1>
      <p>Честный обзор онлайн-казино и подборка лучших предложений.</p>
    </>

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

