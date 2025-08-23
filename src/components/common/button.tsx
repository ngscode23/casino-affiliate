// src/components/ui/button.tsx
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "soft" | "ghost";
  size?: "sm" | "md";
  isActive?: boolean;
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  disabled,
  isActive,
  ...rest
}: Props) {
  const base = "inline-flex items-center justify-center rounded-lg font-semibold focus:outline-none focus-visible:ring-2 ring-offset-2";
  const sizes = {
    sm: "min-h-[44px] px-3 py-2 text-[13px] leading-[1.1]",
    md: "min-h-[44px] px-4 py-2.5 text-[15px] leading-tight"
  } as const;
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    secondary: "bg-slate-800 text-white hover:bg-slate-700",
    soft: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent text-current hover:bg-black/5"
  } as const;

  return (
    <button
      className={cn(
        base,
        sizes[size],
        variants[variant],
        isActive && "ring-2 ring-brand-500",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      disabled={disabled}
      {...rest}
    />
  );
}

