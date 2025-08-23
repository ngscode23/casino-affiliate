import { useId } from "react";
import Button from "@/components/ui/button";

type Props = {
  query: string;
  onQuery: (v: string) => void;
  onClear?: () => void;
  className?: string;
};

export default function FilterBar({ query, onQuery, onClear, className = "" }: Props) {
  const qid = useId();
  return (
    <div className={lex flex-col sm:flex-row gap-3 items-stretch sm:items-end }>
      <div className="flex-1">
        <label htmlFor={qid} className="text-xs text-[var(--text-dim)]">Поиск по названию</label>
        <input
          id={qid}
          className="neon-input w-full"
          placeholder="Например: Mega Casino"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          aria-label="Поиск по названию казино"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onQuery(query)} aria-label="Применить фильтры">Применить</Button>
        {onClear ? (
          <Button variant="soft" onClick={onClear} aria-label="Сброс фильтров">Сбросить</Button>
        ) : null}
      </div>
    </div>
  );
}
