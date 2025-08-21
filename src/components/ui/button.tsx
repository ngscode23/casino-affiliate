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
    const classes = cn(
      "relative",
      buttonVariants({ variant, size }),
      loading && "pointer-events-none opacity-80",
      className
    );

    // Ветка asChild: НИКАКИХ доп. спанов тут — только один child
    if (asChild) {
      // На asChild не поддерживаем встроенный спиннер/иконки, чтобы не сломать <Slot>
      // Если очень надо — положи иконки и спиннер САМ внутрь <a> или <Link>.
      return (
        <Slot
          // ref у <Slot> может быть не button — это нормально, типизируем как any
          ref={ref as any}
          data-slot="button"
          className={classes}
          aria-busy={undefined}
          {...props}
        >
          {children /* ДОЛЖЕН быть ровно один элемент: <a> или <Link> */}
        </Slot>
      );
    }

    // Обычная кнопка
    return (
      <button
        ref={ref}
        data-slot="button"
        className={classes}
        aria-busy={loading || undefined}
        disabled={loading || disabled}
        {...props}
      >
        {leftIcon ? (
          <span className={cn("inline-flex", children && "mr-2 -ml-1")}>
            {leftIcon}
          </span>
        ) : null}

        <span className={loading ? "opacity-0" : ""}>{children}</span>

        {rightIcon ? (
          <span className={cn("inline-flex", children && "ml-2 -mr-1")}>
            {rightIcon}
          </span>
        ) : null}

        {loading && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--text)] border-r-transparent" />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };