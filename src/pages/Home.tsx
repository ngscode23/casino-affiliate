// src/pages/Home.tsx
import { Seo } from "../components/Seo";
import { casinos } from "../data/casinos";
import { ItemListJsonLd } from "../components/ItemListJsonLd";
import { CasinoCard } from "../components/CasinoCard"; // импорт готового компонента

export function Home() {
  const enabled = casinos
    .filter(c => c.enabled !== false)
    .sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999));

  return (
    <>
      <Seo
        title="Топ онлайн-казино — Casino Watch"
        description="Подборка лучших онлайн-казино с лицензией и быстрыми выплатами. 18+."
      />

      <ItemListJsonLd
        items={enabled.map((c, i) => ({
          name: c.name,
          url: c.link,
          position: i + 1,
        }))}
      />

      <section className="space-y-6">
        <h1 className="text-2xl font-bold">Лучшие онлайн-казино 2025</h1>
        <p className="text-slate-300">
          Ниже список проверенных операторов с рейтингами и выплатами.
        </p>

        <ul className="casino-list">
          {enabled.map(c => (
            <CasinoCard key={c.name} offer={c} />
          ))}
        </ul>
      </section>
    </>
  );
}