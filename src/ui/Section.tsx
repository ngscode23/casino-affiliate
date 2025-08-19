export default function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`neon-container ${className}`}>{children}</section>;
}