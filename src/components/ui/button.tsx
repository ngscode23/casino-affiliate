// src/components/ui/button.tsx
import React, { forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "soft" | "ghost";
type Size = "default" | "sm" | "icon";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-black hover:opacity-90",
  secondary: "bg-white/10 text-[var(--text)] hover:bg-white/15",
  soft: "bg-white/5 text-[var(--text)] hover:bg-white/10",
  ghost: "bg-transparent text-[var(--text)] hover:bg-white/10",
};

const sizeClasses: Record<Size, string> = {
  default: "h-9 px-3 py-2",
  sm: "h-8 px-2.5 py-1.5 text-xs",
  icon: "h-9 w-9 p-0",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "default", className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
});

export default Button;