type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "soft" };
export default function Button({ variant = "primary", className = "", ...p }: Props) {
  const extra = variant === "secondary" ? "bg-transparent border border-white/10 text-[var(--text)] hover:bg-white/5"
               : variant === "soft"      ? "bg-[var(--surface)] border border-white/10 text-[var(--text)] hover:border-white/20"
               : "";
  return <button {...p} className={`neon-btn ${extra} ${className}`} />;
}