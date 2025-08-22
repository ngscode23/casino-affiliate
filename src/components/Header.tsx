// src/components/Header.tsx
import Section from "@/components/ui/section";
import { Link } from "react-router-dom";
import Button from "@/components/ui/button";
import AuthButton from "@/components/AuthButton"; // ❌ Если у тебя нет AuthButton.tsx — удали импорт ниже или создай заглушку

// ❌ Если у тебя нет AuthDialog.tsx — удали импорт ниже или создай заглушку
// import AuthDialog from "@/components/AuthDialog";


import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--bg-0)]/80 backdrop-blur">
      <Section className="flex h-16 items-center justify-between gap-4">
        {/* Лого слева */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to="/"
            className="cursor-pointer text-xl font-extrabold tracking-tight text-[var(--text)] hover:opacity-90"
            aria-label="Go to Home"
          >
            CasinoHub
          </Link>
          <span className="hidden sm:inline-flex items-center text-xs text-[var(--text-dim)]">
            <span className="neon-chip">Trusted 4.8★</span>
          </span>
        </div>

        {/* Desktop навигация */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/compare"
            className="cursor-pointer text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
          >
            Compare
          </Link>
          <Link
            to="/favorites"
            className="cursor-pointer text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
          >
            Favorites
          </Link>

          {/* Если есть AuthDialog — раскомментируй */}
          {/* <AuthDialog /> */}
          <Button className="ml-2">Sign Up</Button>
        </nav>

        {/* Мобильный бургер */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="cursor-pointer"
              >
                <Menu className="h-6 w-6 text-[var(--text)]" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-72 bg-[var(--bg-0)] text-[var(--text)] border-r border-white/10"
            >
              {/* A11y заголовок */}
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation menu</SheetTitle>
                <SheetDescription>Open the site navigation</SheetDescription>
              </SheetHeader>

              <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="cursor-pointer hover:underline">
                  Home
                </Link>
         
  <Link to="/compare" className="cursor-pointer text-sm text-[var(--text-dim)] hover:text-[var(--text)]">Compare</Link>
  <Link to="/favorites" className="cursor-pointer text-sm text-[var(--text-dim)] hover:text-[var(--text)]">Favorites</Link>
  <AuthButton />

                <Button className="mt-2 w-full">Sign Up</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Section>
    </header>
  );
}