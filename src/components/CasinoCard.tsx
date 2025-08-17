type Props = {
  name:string; rating:number; license:string; payout:string; methods:string; link:string;
};

export function CasinoCard({ name, rating, license, payout, methods, link }: Props) {
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
        <a
          href={link}
          target="_blank"
          rel="noreferrer nofollow"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-sky-400 px-4 py-2 font-semibold text-slate-900 hover:brightness-95"
        >
          Перейти
        </a>
        <a
          href="#/compare"
          className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
        >
          Обзор
        </a>
      </div>

      <p className="mt-2 text-xs text-slate-500">Партнёрская ссылка. 18+.</p>
    </li>
  );
}