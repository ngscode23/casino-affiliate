// src/components/CasinoCard.tsx
import type { Offer } from "../data/casinos";
import { track } from "../lib/analytics";

export function CasinoCard({ offer }: { offer: Offer }) {
  const { name, license, payout, methods, link } = offer; // добавил link

  return (
    <li className="rounded-lg border border-slate-800 p-4">
      <h2 className="text-lg font-bold">{name}</h2>
      <p>Лицензия: {license}</p>
      <p>Выплаты: {payout}</p>
      <p>Методы: {methods.join(", ")}</p>

      {link && (
        <a
          onClick={() => track("offer_click", { name })}
          href={link}
          target="_blank"
          rel="noreferrer nofollow"
          className="inline-flex items-center rounded-xl bg-sky-400 px-4 py-2 font-semibold text-slate-900 hover:brightness-95"
        >
          Перейти
        </a>
      )}
    </li>
  );
}