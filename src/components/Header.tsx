import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60 hover:text-white">
      {children}
    </a>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#/" className="text-sm font-black uppercase tracking-wide text-slate-200">Casino Watch</a>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="#/compare">Сравнение</NavLink>
          <NavLink href="#/guides">Гайды</NavLink>
          <NavLink href="#/responsible">Ответственная игра</NavLink>
        </nav>

        <button onClick={() => setOpen(v => !v)} className="rounded-lg p-2 hover:bg-slate-800/60 md:hidden" aria-label="Меню">≡</button>
      </div>

      {open && (
        <div className="border-t border-slate-800/80 md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-2 grid gap-1">
            <a onClick={()=>setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-800/60" href="#/compare">Сравнение</a>
            <a onClick={()=>setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-800/60" href="#/guides">Гайды</a>
            <a onClick={()=>setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-800/60" href="#/responsible">Ответственная игра</a>
          </div>
        </div>
      )}
    </header>
  );
}