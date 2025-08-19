export default function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`neon-chip ${className}`} data-glow>{children}</span>;
}