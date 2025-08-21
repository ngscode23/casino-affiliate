import { PropsWithChildren } from "react";
export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <div className={`card ${className}`}>{children}</div>;
}
export default Card;

