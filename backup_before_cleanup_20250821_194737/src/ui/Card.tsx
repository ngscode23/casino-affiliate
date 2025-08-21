export default function Card({ children, featured = false, className = "" }: { children: React.ReactNode; featured?: boolean; className?: string }) {
  return <div className={`neon-card ${featured ? "featured" : ""} ${className}`}>{children}</div>;
}