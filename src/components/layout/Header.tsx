// src/components/layout/Header.tsx
import { Link, NavLink } from "react-router-dom";
import Section from "@/components/common/section";
import cn from "@/lib/cn";
import MobileNav from "./MobileNav";
import AuthButton from "@/components/AuthButton"; // если не нужен — удаляй импорт и блок

const nav = [
  { to: "/offers", label: "Offers" },
  { to: "/compare", label: "Compare" },
  { to: "/favorites", label: "Favorites" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--bg-0)]/80 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-0)]/60">
      <Section className="flex h-14 md:h-16 items-center justify-between gap-3">
        {/* Logo */}
        <div className="min-w-0">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight text-[var(--text)] hover:opacity-90"
            aria-label="Go to Home"
          >
            {import.meta.env.VITE_SITE_NAME ?? "SITE"}
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                  isActive && "bg-white/10 text-[var(--text)]"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Auth (если используешь) */}
          <div className="ml-2">
            <AuthButton />
          </div>

          {/* Пример CTA как Link, не <a> */}
          <Link
            to="/compare"
            className="ml-1 inline-flex items-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-600"
          >
            Start Compare
          </Link>
        </nav>

        {/* Mobile burger */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </Section>
    </header>
  );
}