import React, { useState } from "react";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#/" className="text-sm font-black uppercase tracking-wide text-slate-200">Casino Watch</a>
        <nav className="hidden items-center gap-1 md:flex">
          <a className="rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/60" href="#/compare">Сравнение</a>
          <a className="rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/60" href="#/guides">Гайды</a>
          <a className="rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/60" href="#/responsible">Ответственная игра</a>
        </nav>
      </div>
    </header>
  );
}