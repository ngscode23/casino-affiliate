import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Skeleton({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/10", // базовая «мигалка»
        className
      )}
      {...props}
    />
  );
}
















