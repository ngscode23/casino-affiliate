import { useEffect, useState } from "react";

const LS_KEY = "cookie-consent:v1";

export default function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(LS_KEY);
      setVisible(v !== "accepted");
    } catch {
      // localStorage недоступен — просто не показываем бар
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      localStorage.setItem(LS_KEY, "accepted");
    } catch {
      // игнорируем ошибку записи
    }
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 bg-gray-900 text-white/90 p-4 border-t border-white/10"
    >
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm">
          Мы используем cookies для аналитики и улучшения контента. Продолжая пользоваться сайтом, вы
          соглашаетесь с{" "}
          <a href="/privacy" className="underline">
            политикой конфиденциальности
          </a>
          .
        </p>
        <div className="ml-auto flex gap-2">
          <button onClick={accept} className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-500">
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}