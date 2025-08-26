// src/components/FavControl.tsx
import React from "react";
import { useFavorites } from "@/lib/useFavorites";

export type FavControlProps = {
  id: string;
  className?: string;
  onToggle?: (active: boolean) => void;
  titleOn?: string;
  titleOff?: string;
};

export function FavControl({
  id,
  className,
  onToggle,
  titleOn = "Убрать из избранного",
  titleOff = "В избранное",
}: FavControlProps) {
  const { items, toggle } = useFavorites();
  const active = items.includes(id);

  const handleClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    // toggle возвращает boolean — новое состояние (должно быть так в useFavorites)
    const next = toggle(id);
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? titleOn : titleOff}
      title={active ? titleOn : titleOff}
      onClick={handleClick}
      className={className ?? "inline-flex h-10 w-10 items-center justify-center rounded"}
    >
      <span aria-hidden style={{ lineHeight: 1 }}>
        {active ? "★" : "☆"}
      </span>
    </button>
  );
}

// Provide both named and default export so old and new imports work
export default FavControl;

