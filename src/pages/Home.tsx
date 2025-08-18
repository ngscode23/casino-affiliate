import HomeHero from "../components/HomeHero";
import OfferCardPFM from "../components/OfferCardPFM";
import { casinos } from "../data/casinos";
import Seo from "../components/Seo";
import OrgJsonLd from "../components/OrgJsonLd";
import SiteJsonLd from "../components/SiteJsonLd";
import ItemListJsonLd from "../components/ItemListJsonLd";
import { SITE_URL } from "../config/site";

const enabled = casinos.filter(c => c.enabled !== false);

export default function Home() {
  return (
    <>
      <Seo title="Casino Watch — сравнение офферов" description="Рейтинг, лицензии и скорость выплат онлайн-казино." canonical={`${SITE_URL}/`} />
      <OrgJsonLd /><SiteJsonLd />
      <ItemListJsonLd items={enabled.map((c,i)=>({ name:c.name, url:c.link?.startsWith("http")?c.link:`${SITE_URL}${c.link ?? (c.slug?`/go/${c.slug}`:"/")}`, position:i+1 }))} />

      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 pb-16">
        {enabled.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-card">
            Пока нет доступных офферов.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enabled.map((c) => (
              <OfferCardPFM key={c.slug ?? c.name} offer={c} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}