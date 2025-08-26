import React, { useEffect, useMemo, useState } from "react";
import { useFavorites } from "@/lib/useFavorites";

export type FavControlProps = {
  id: string;
  className?: string;
  onToggle?: (active: boolean) => void;
  titleOn?: string;
  titleOff?: string;
};

function normalizeKey(slug: any): string {
  try { return String(slug ?? "").trim(); } catch { return ""; }
}

export default function FavControl({
  id,
  className,
  onToggle,
  titleOn = "Убрать из избранного",
  titleOff = "В избранное",
}: FavControlProps) {
  // Подключаем хук и получаем items/toggle
  const { items, toggle } = useFavorites();

  const key = useMemo(() => normalizeKey(id), [id]);

  // authoritative state (из хука)
  const authoritative = useMemo(() => items.includes(key), [items, key]);

  // optimistic state: null = use authoritative, true/false = override
  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  // дисплейное состояние — что показывать
  const active = optimistic === null ? authoritative : optimistic;

  // при смене authoritative (внешне) сбрасываем optimistic — позволяем "источнику правды" управлять
  useEffect(() => {
    // если authoritative совпадает с optimistic — очистим optimistic
    if (optimistic !== null && authoritative === optimistic) {
      setOptimistic(null);
    }
    // если authoritative отличается и optimistic === null — оставляем authoritative
    // если authoritative меняется (например из-за синхронизации с сервером) — просто перерендерим
  }, [authoritative, optimistic]);

  const handleClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    // toggle возвращает новое состояние (true = в избранном, false = убрано)
    const next = toggle(key);
    // optimistic: показываем результат сразу
    setOptimistic(next);
    // коллбек внешнему коду (трекинг)
    onToggle?.(next);
  };

  const base = className ?? "inline-flex h-10 w-10 items-center justify-center rounded";
  const colorClass = active ? "text-amber-400" : "text-white/70 hover:text-white";

  return (
    <button
      type="button"
      aria-pressed={active}
      title={active ? titleOn : titleOff}
      onClick={handleClick}
      className={`${base} ${colorClass}`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span aria-hidden style={{ lineHeight: 1, fontSize: "1.15rem" }}>
        {active ? "★" : "☆"}
      </span>
    </button>
  );
}