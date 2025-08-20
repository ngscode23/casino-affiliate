export default function Section({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`neon-container px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}