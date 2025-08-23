// src/components/CookieBar.tsx
import * as React from "react";
import Section from "@/components/common/section";
import Button from "@/components/common/button";
import { getCookie, setCookie } from "@/lib/cookies";

const CK_ANALYTICS = "cc_analytics";
const CK_MARKETING = "cc_marketing";
const CK_VER = "cc_version"; // на случай будущих изменений политики

export default function CookieBar({ className = "" }: { className?: string }) {
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => {
    const a = getCookie(CK_ANALYTICS);
    const m = getCookie(CK_MARKETING);
    if (a !== null || m !== null) {
      applyAttributes(a === "1", m === "1");
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  const applyAttributes = (a: boolean, m: boolean) => {
    document.documentElement.setAttribute("data-analytics-consent", a ? "granted" : "denied");
    document.documentElement.setAttribute("data-marketing-consent", m ? "granted" : "denied");
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: { analytics: a, marketing: m } }));
  };

  const persist = (a: boolean, m: boolean) => {
    // год жизни, secure/samesite=Lax
    setCookie(CK_ANALYTICS, a ? "1" : "0", { maxAgeDays: 365 });
    setCookie(CK_MARKETING, m ? "1" : "0", { maxAgeDays: 365 });
    setCookie(CK_VER, "1", { maxAgeDays: 365 });
    applyAttributes(a, m);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={`fixed inset-x-0 bottom-0 z-[70] ${className}`}>
      <Section className="px-0">
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[var(--bg-1)]/95 backdrop-blur p-4 shadow-[0_12px_32px_rgba(0,0,0,.45)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="text-sm leading-relaxed">
              Мы используем cookies для работы сайта и аналитики.
              Нажимая <b>Accept all</b>, вы соглашаетесь на аналитические и маркетинговые cookies. Или откройте{" "}
              <button className="underline cursor-pointer" onClick={() => setExpanded((v) => !v)}>
                Settings
              </button>.
            </div>
            <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
              <Button variant="soft" onClick={() => persist(false, false)} aria-label="Only necessary">
                Only necessary
              </Button>
              <Button onClick={() => persist(true, true)} aria-label="Accept all">
                Accept all
              </Button>
            </div>
          </div>

          {expanded && (
            <div className="mt-4 rounded-xl border border-white/10 bg-[var(--bg-0)] p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-start gap-3">
                  <input type="checkbox" checked disabled className="mt-1" />
                  <div>
                    <div className="font-medium">Necessary</div>
                    <div className="text-xs text-[var(--text-dim)]">Нужны для базовой работы сайта. Всегда включены.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">Analytics</div>
                    <div className="text-xs text-[var(--text-dim)]">Помогают понять поведение пользователей.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">Marketing</div>
                    <div className="text-xs text-[var(--text-dim)]">Ретаргетинг, персональные офферы.</div>
                  </div>
                </label>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button variant="soft" onClick={() => setExpanded(false)} aria-label="Hide settings">
                  Cancel
                </Button>
                <Button onClick={() => persist(analytics, marketing)} aria-label="Save selection">
                  Save selection
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

