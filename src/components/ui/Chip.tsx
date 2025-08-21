// src/ui/Chip.tsx
import type { HTMLAttributes, ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  className?: string;
  /** включает подсветку через data-атрибут */
  glow?: boolean;
} & HTMLAttributes<HTMLSpanElement>;

export default function Chip({
  children,
  className = "",
  glow = false,
  ...rest
}: ChipProps) {
  return (
    <span
      className={`neon-chip ${className}`}
      // если glow=true — добавляем data-glow, иначе не ставим атрибут вовсе
      data-glow={glow || undefined}
      {...rest}
    >
      {children}
    </span>
  );
}
