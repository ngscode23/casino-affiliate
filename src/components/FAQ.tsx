type QA = { q: string; a: string };
export default function FAQ({ items, className = "" }: { items: QA[]; className?: string }) {
  return (
    <div className={space-y-4 }>
      {items.map((it, i) => (
        <details key={i} className="rounded-xl border border-white/10 p-4 bg-[var(--bg-1)]">
          <summary className="cursor-pointer font-medium">{it.q}</summary>
          <div className="mt-2 text-sm text-[var(--text-dim)]">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
