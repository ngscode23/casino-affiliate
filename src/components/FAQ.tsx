import * as React from "react";

type Item = { q: string; a: React.ReactNode };

export default function FAQ({
  items,
  className = "",
}: {
  items: Item[];
  className?: string;
}) {
  if (!items?.length) return null;

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">FAQ</h2>
      <div className="space-y-3">
        {items.map((it, i) => (
          <details key={i} className="rounded-lg border border-white/10 p-3">
            <summary className="cursor-pointer font-medium">{it.q}</summary>
            <div className="mt-2 text-sm text-[var(--text-dim)]">{it.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

