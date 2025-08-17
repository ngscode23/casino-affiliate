export function AgeGate({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/90 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h2 className="text-xl font-bold">Вам уже есть 18 лет?</h2>
        <p className="mt-2 text-sm text-slate-400">Сайт содержит информацию о ставках. Мы не обещаем выигрышей. Играйте ответственно.</p>
        <div className="mt-4 flex gap-2">
          <a className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
             href="https://www.begambleaware.org" target="_blank" rel="noreferrer">Мне нет 18</a>
          <button onClick={onAccept}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:brightness-95">
            Да, мне 18+
          </button>
        </div>
      </div>
    </div>
  );
}
