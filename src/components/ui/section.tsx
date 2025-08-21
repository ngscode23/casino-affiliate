import { PropsWithChildren } from "react";
export function Section({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <section className={`container ${className}`}>{children}</section>;
}
export default Section;

