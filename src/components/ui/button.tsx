// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button-variants";
import { cn } from "@/lib/utils";

type LoadingProps = {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> &
  LoadingProps & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        // нужен relative для спиннера поверх контента
        className={cn(
          "relative",
          buttonVariants({ variant, size }),
          loading && "pointer-events-none opacity-80",
          className
        )}
        aria-busy={loading || undefined}
        // блокируем кнопку в режиме загрузки
        disabled={loading || disabled}
        {...props}
      >
        {/* left icon */}
        {leftIcon ? (
          <span className={cn("inline-flex", children && "mr-2 -ml-1")}>
            {leftIcon}
          </span>
        ) : null}

        {/* контент прячем на время лоадинга, чтобы не прыгала ширина */}
        <span className={loading ? "opacity-0" : ""}>{children}</span>

        {/* right icon */}
        {rightIcon ? (
          <span className={cn("inline-flex", children && "ml-2 -mr-1")}>
            {rightIcon}
          </span>
        ) : null}

        {/* спиннер поверх */}
        {loading && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--text)] border-r-transparent" />
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };