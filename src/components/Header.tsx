import Section from "../ui/Section";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--bg-0)]/80 backdrop-blur">
      <Section className="h-16 flex items-center justify-between">
        {/* Лого */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="text-xl font-bold text-[var(--text)]">CasinoHub</div>
          <span className="hidden sm:inline-block text-sm text-[var(--text-dim)]">
            Trusted <span className="font-semibold">4.8★</span>
          </span>
        </div>

        {/* Desktop меню */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#offers" className="text-sm text-[var(--text-dim)] hover:text-[var(--text)]">Offers</a>
          <a href="#compare" className="text-sm text-[var(--text-dim)] hover:text-[var(--text)]">Compare</a>
          <div className="ml-2">
            <Button>Sign Up</Button>
          </div>
        </nav>

        {/* Mobile бургер */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6 text-[var(--text)]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-[var(--bg-0)] text-[var(--text)] border-r border-white/10">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Site menu</SheetDescription>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-5 text-base">
                <a href="#offers" className="hover:underline">Offers</a>
                <a href="#compare" className="hover:underline">Compare</a>
                <Button className="mt-2">Sign Up</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Section>
    </header>
  );
}