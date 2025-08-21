// rating.tsx
export default function Rating({ value = 0, className = "" }: { value?: number; className?: string }) {
  return <div className={className}>★ {value.toFixed(1)}</div>;
}
export { default as Rating } from "./rating";

