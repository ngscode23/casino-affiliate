// src/lib/analytics.ts

// Объявляем тип gtag в глобальном window
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// вспомогалка: есть ли gtag
const hasGtag = (): boolean =>
  typeof window !== "undefined" && typeof window.gtag === "function";

/**
 * Отправить просмотр страницы
 */
export function gaPageview(path?: string) {
  if (!hasGtag()) return;
  window.gtag!("event", "page_view", {
    page_path: path ?? (typeof location !== "undefined" ? location.pathname : "/"),
  });
}

/**
 * Универсальное событие
 */
export function gaEvent(
  action: string,
  params?: Record<string, unknown>
) {
  if (!hasGtag()) return;
  window.gtag!("event", action, params ?? {});
}

/**
 * Обновление consent (синхронно с CookieBar / AnalyticsGateGA)
 */
export function gaConsentUpdate(opts: { analytics: boolean; marketing: boolean }) {
  if (!hasGtag()) return;
  const { analytics, marketing } = opts;
  window.gtag!("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });
}

// Совместимость со старым кодом:
export function track(name: string, params?: Record<string, unknown>) {
  return gaEvent(name, params);
}

export const trackPage = gaPageview;














