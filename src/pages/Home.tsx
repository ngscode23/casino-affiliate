import React from "react";
import { CasinoCard } from "../components/CasinoCard";

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

export function Home() {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [texts, setTexts] = React.useState<{ badge: string; title: string; subtitle: string } | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/content/offers.json")
      .then(r => { if (!r.ok) throw new Error("offers.json " + r.status); return r.json(); })
      .then(d => {
        const items = (d.items as Offer[]).filter(o => o.enabled).sort((a,b) => a.position - b.position);
        setOffers(items);
      })
      .catch(e => setErr("Не удалось загрузить офферы: " + e.message));

    fetch("/content/home.json")
      .then(r => { if (!r.ok) throw new Error("home.json " + r.status); return r.json(); })
      .then(setTexts)
      .catch(e => setErr("Не удалось загрузить тексты: " + e.message));
  }, []);

  if (err) {
    return (
      <section className="rounded-2xl border border-rose-800 bg-rose-950/40 p-6">
        <h2 className="text-xl font-bold">Ошибка</h2>
        <p className="text-sm text-rose-300 mt-2">{err}</p>
        <p className="text-xs text-slate-400 mt-1">
          Проверь, что файлы лежат в <code>/public/content/</code> и пути в fetch начинаются с <code>/content/...</code>.
        </p>
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
          <CasinoCard key={o.name} name={o.name} rating={o.rating} license={o.license}
            payout={o.payout} methods={o.methods} link={o.link} />
        ))}
      </ul>
    </section>
  );
}
