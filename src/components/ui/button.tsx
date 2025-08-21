import React, { forwardRef, isValidElement, cloneElement, type ReactElement } from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "soft" | "ghost";
  size?: "default" | "icon";
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
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
    const child = children as ReactElement<{ className?: string }>;
    // не проталкиваем button-only атрибуты в <a>/<Link>
    const { type: _t, disabled: _d, ...safe } = rest as Omit<ButtonProps, "className" | "children" | "variant" | "size" | "asChild">;
    return cloneElement(child, {
      className: cx(child.props?.className, classes),
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