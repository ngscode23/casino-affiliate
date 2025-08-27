// src/components/faq/Faq.tsx
import { useId, useMemo } from "react";

export type FaqItem = { q: string; a: string };
type Props = {
  items: FaqItem[];
  className?: string;
  title?: string;
};

export default function Faq({ items, className, title = "FAQ" }: Props) {
  const baseId = useId();
  const list = useMemo(
    () => items.filter(i => i.q?.trim() && i.a?.trim()),
    [items]
  );

  if (!list.length) return null;

  return (
    <section className={className ?? "neon-card p-4"}>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <ul className="space-y-3">
        {list.map((it, idx) => {
          const qId = `${baseId}-q-${idx}`;
          const aId = `${baseId}-a-${idx}`;
          return (
            <li key={idx} className="border border-white/10 rounded-lg">
              <details>
                <summary
                  id={qId}
                  aria-controls={aId}
                  className="cursor-pointer list-none px-3 py-2 font-medium"
                >
                  {it.q}
                </summary>
                <div
                  id={aId}
                  role="region"
                  aria-labelledby={qId}
                  className="px-3 pb-3 pt-1 opacity-90"
                >
                  {it.a}
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}