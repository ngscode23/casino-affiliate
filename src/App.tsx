// src/App.tsx
function App() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          🚀 Tailwind + React работает
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Это стартовая страница проекта. Дальше сюда добавим ваш интерфейс казино-аффилиата.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="https://tailwindcss.com/docs"
            target="_blank"
            className="rounded-lg bg-brand-500 px-5 py-2.5 font-medium text-white shadow-card hover:bg-brand-600 transition"
          >
            Документация Tailwind
          </a>
          <a
            href="https://vite.dev/guide/"
            target="_blank"
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-white shadow-card transition"
          >
            Гайд Vite
          </a>
        </div>
      </section>
    </main>
  );
}

export default App;