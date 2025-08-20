// src/components/Header.tsx
import Section from "../ui/Section";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--bg-0)]/80 backdrop-blur">
      <Section className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link to="/" className="text-xl font-bold text-[var(--text)]">CasinoHub</Link>
          <span className="hidden sm:inline-block text-sm text-[var(--text-dim)]">
            Trusted <span className="font-semibold">4.8★</span>
          </span>
        </div>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/compare" className="text-sm text-[var(--text-dim)] hover:text-[var(--text)]">Compare</Link>
          <Button className="ml-2">Sign Up</Button>
        </nav>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6 text-[var(--text)]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-[var(--bg-0)] text-[var(--text)] border-r border-white/10">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation menu</SheetTitle>
                <SheetDescription>Open the site navigation</SheetDescription>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6 text-lg">
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/compare" className="hover:underline">Compare</Link>
                <Button className="mt-2 w-full">Sign Up</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Section>
    </header>
  );
}