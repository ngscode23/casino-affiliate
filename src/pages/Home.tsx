// src/pages/Home.tsx
import Seo from "../components/Seo";
import OrgJsonLd from "../components/OrgJsonLd";
import SiteJsonLd from "../components/SiteJsonLd";
import ItemListJsonLd from "../components/ItemListJsonLd";
import { CasinoCard } from "../components/CasinoCard"; // ← ты это пропустил
import { SITE_URL } from "../config/site";
import { casinos } from "../data/casinos";

const enabled = casinos.filter((c) => c.enabled !== false);

export default function Home() {
  return (
    <>
      <Seo
        title="Casino Watch — сравнение офферов"
        description="Рейтинг, лицензии и скорость выплат онлайн-казино."
        canonical={`${SITE_URL}/`}
      />

      {/* JSON-LD */}
      <OrgJsonLd />
      <SiteJsonLd />
      <ItemListJsonLd
        items={enabled.map((c, i) => ({
          name: c.name,
          // абсолютные URL для JSON-LD
          url:
            c.link && /^https?:\/\//i.test(c.link)
              ? c.link
              : `${SITE_URL}${c.link ?? (c.slug ? `/go/${c.slug}` : "/")}`,
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
              <CasinoCard key={c.slug ?? c.name} offer={c} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}