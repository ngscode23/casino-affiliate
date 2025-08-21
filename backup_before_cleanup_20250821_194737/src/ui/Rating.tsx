export default function Rating({ value }: { value: number }) {
  const full = Math.floor(value), half = value - full >= 0.5;
  return (
    <div aria-label={`Rating ${value}`} className="flex items-center gap-1 text-sm">
      {Array.from({ length: full }).map((_, i) => <span key={i}>★</span>)}
      {half && <span>☆</span>}
      <span className="ml-1 text-[var(--text-dim)]">{value.toFixed(1)}</span>
    </div>
  );
};
