// src/pages/Home.tsx
import { Seo } from "../components/Seo";
import { ItemListJsonLd } from "../components/ItemListJsonLd";
import { OrgJsonLd } from "../components/OrgJsonLd";
import { SiteJsonLd } from "../components/SiteJsonLd";
import { CasinoCard } from "../components/CasinoCard";
import { casinos } from "../data/casinos";

export function Home() {
  const enabled = casinos
    .filter((c) => c.enabled !== false)
    .sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999));

  return (
    <>
      <Seo
        title="Топ онлайн-казино — Casino Watch"
        description="Подборка лучших онлайн-казино с лицензией и быстрыми выплатами. 18+."
        // canonical="https://your-domain.com/"
      />

      {/* Структурированные данные сайта/организации */}
      <OrgJsonLd />
      <SiteJsonLd />

      {/* JSON-LD списка офферов */}
      <ItemListJsonLd
        items={enabled.map((c, i) => ({
          name: c.name,
          url: c.link ?? (c.slug ? `/go/${c.slug}` : "#"),
          position: i + 1,
        }))}
      />

      <section className="space-y-6">
        <h1 className="text-2xl font-bold">Лучшие онлайн-казино 2025</h1>
        <p className="text-slate-300">
          Ниже список проверенных операторов с рейтингами и выплатами.
        </p>

        {enabled.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
            Пока нет доступных офферов.
          </div>
        ) : (
          <ul className="casino-list">
            {enabled.map((c) => (
              <CasinoCard key={c.name} offer={c} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}