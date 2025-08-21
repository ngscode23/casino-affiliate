// src/components/CookieBar.tsx
import * as React from "react";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

const STORAGE_KEY = "cookie-consent-v1";

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed &&
      parsed.necessary === true &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.marketing === "boolean"
    ) {
      return parsed as Consent;
    }
  } catch {}
  return null;
}

function saveConsent(c: Consent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  // Пометим на html для сторонних скриптов/стилей
  document.documentElement.setAttribute("data-analytics-consent", c.analytics ? "granted" : "denied");
  document.documentElement.setAttribute("data-marketing-consent", c.marketing ? "granted" : "denied");
  // Шлём событие, если кто-то хочет подписаться
  window.dispatchEvent(new CustomEvent("cookie-consent", { detail: c }));
}

export default function CookieBar({ className = "" }: { className?: string }) {
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => {
    // при первом рендере проверяем, есть ли согласие
    const existing = readConsent();
    if (existing) {
      // применим атрибуты, чтобы страница знала про согласие
      saveConsent(existing);
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  const acceptAll = React.useCallback(() => {
    const c: Consent = { necessary: true, analytics: true, marketing: true, timestamp: Date.now() };
    saveConsent(c);
    setVisible(false);
  }, []);

  const rejectNonEssential = React.useCallback(() => {
    const c: Consent = { necessary: true, analytics: false, marketing: false, timestamp: Date.now() };
    saveConsent(c);
    setVisible(false);
  }, []);

  const saveSelected = React.useCallback(() => {
    const c: Consent = { necessary: true, analytics, marketing, timestamp: Date.now() };
    saveConsent(c);
    setVisible(false);
  }, [analytics, marketing]);

  if (!visible) return null;

  return (
    <div className={`fixed inset-x-0 bottom-0 z-[70] ${className}`}>
      <Section className="px-0">
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[var(--bg-1)]/95 backdrop-blur p-4 shadow-[0_12px_32px_rgba(0,0,0,.45)]">
          {/* Текст */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="text-sm leading-relaxed">
              Мы используем cookies для работы сайта и аналитики. Нажимая <b>Accept all</b>, вы
              соглашаетесь на использование аналитических и маркетинговых cookies. Можно выбрать
              категории в <button className="underline cursor-pointer" onClick={() => setExpanded(v => !v)}>
                Settings
              </button>.
            </div>

            {/* Основные кнопки */}
            <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
              <Button variant="soft" onClick={rejectNonEssential} aria-label="Use only necessary">Only necessary</Button>
              <Button onClick={acceptAll} aria-label="Accept all cookies">Accept all</Button>
            </div>
          </div>

          {/* Расширенные настройки */}
          {expanded && (
            <div className="mt-4 rounded-xl border border-white/10 bg-[var(--bg-0)] p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked disabled className="mt-1 cursor-not-allowed" />
                  <div>
                    <div className="font-medium">Necessary</div>
                    <div className="text-xs text-[var(--text-dim)]">Нужны для базовой работы сайта. Всегда включены.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={e => setAnalytics(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">Analytics</div>
                    <div className="text-xs text-[var(--text-dim)]">Помогают понять, что люди делают на сайте.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={e => setMarketing(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">Marketing</div>
                    <div className="text-xs text-[var(--text-dim)]">Персональные предложения и ретаргетинг.</div>
                  </div>
                </label>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button variant="soft" onClick={() => setExpanded(false)} aria-label="Hide settings">Cancel</Button>
                <Button onClick={saveSelected} aria-label="Save selected cookies">Save selection</Button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}