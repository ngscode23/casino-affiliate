export function CookieBar({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-5xl rounded-t-2xl border border-slate-800 bg-slate-900/95 p-4 text-sm shadow-2xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-slate-300">Мы используем cookie для аналитики. Продолжая пользоваться сайтом, вы соглашаетесь.</p>
        <button onClick={onAccept} className="rounded-xl bg-slate-800 px-4 py-2 font-semibold hover:bg-slate-700">Принять</button>
      </div>
    </div>
  );
}
