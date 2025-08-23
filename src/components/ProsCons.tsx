export default function ProsCons({
  pros = [],
  cons = [],
  className = "",
}: { pros?: string[]; cons?: string[]; className?: string }) {
  return (
    <div className={grid gap-4 sm:grid-cols-2 }>
      <div className="rounded-xl border border-emerald-500/20 p-4">
        <div className="font-semibold mb-2">Плюсы</div>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {pros.length ? pros.map((p, i) => <li key={i}>{p}</li>) : <li>—</li>}
        </ul>
      </div>
      <div className="rounded-xl border border-red-500/20 p-4">
        <div className="font-semibold mb-2">Минусы</div>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {cons.length ? cons.map((c, i) => <li key={i}>{c}</li>) : <li>—</li>}
        </ul>
      </div>
    </div>
  );
}
