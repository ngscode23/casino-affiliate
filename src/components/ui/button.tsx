// src/components/ui/button.tsx
import React, { forwardRef, isValidElement, cloneElement } from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "soft" | "ghost";
  size?: "default" | "icon";
  asChild?: boolean;
  className?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", size = "default", asChild = false, className = "", children, ...rest },
  ref
) {
  const classes = cx(
    "btn",
    variant !== "default" && variant,
    size === "icon" && "btn-icon",
    className
  );

  if (asChild && isValidElement(children)) {
    // не тащим button-only атрибуты в <a>/<Link>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, disabled, ...safe } = rest as any;
    return cloneElement(children, {
      className: cx((children as any).props?.className, classes),
      ...safe,
    });
  }

  return (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  );
});

export default Button;