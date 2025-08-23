// src/lib/analytics.ts
// Единая точка входа для аналитики. Разделяет analytics/marketing по consent.
// Не лезет в DOM без нужды, не падает, когда GA не загружен.

type ConsentMap = { analytics: boolean; marketing: boolean };

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    __cookieConsent?: ConsentMap;
  }
}

export const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

export type AnalyticsEvent =
  | { name: "view_page"; params: { path: string } }
  | { name: "click_affiliate_link"; params: { offer_slug: string; position?: number } }
  | { name: "toggle_filter"; params: { filter: string; value: string } }
  | { name: "add_to_compare"; params: { offer_slug: string; position?: number } } // ← добавили
  | { name: "favorite_toggle"; params: { offer_slug: string; active: boolean } }
  | { name: "submit_lead"; params: { source: "contact_form" | "other" } };
type Channel = "analytics" | "marketing";

const eventChannel: Record<AnalyticsEvent["name"], Channel> = {
  view_page: "analytics",
  toggle_filter: "analytics",
  add_to_compare: "analytics",
  favorite_toggle: "analytics",
  submit_lead: "analytics",
  click_affiliate_link: "marketing"
};

const queue: AnalyticsEvent[] = [];
let gaReady = false;

export function setGaReady(ready: boolean) {
  gaReady = ready;
  if (gaReady) flushQueue();
}

export function getConsent(): ConsentMap {
  // Источник — CookieBar. При необходимости замените на ваш стор.
  const fallback: ConsentMap = { analytics: false, marketing: false };
  try {
    return window.__cookieConsent ?? fallback;
  } catch {
    return fallback;
  }
}

function allowedByConsent(evt: AnalyticsEvent): boolean {
  const ch = eventChannel[evt.name];
  const c = getConsent();
  return ch === "marketing" ? !!c.marketing : !!c.analytics;
}

function sendToGa(evt: AnalyticsEvent) {
  if (!GA_ID || !window.gtag) return;
  // Отправляем custom event в GA4
  window.gtag("event", evt.name, evt.params);
}

function flushQueue() {
  // Отправляем, только если теперь и GA готов, и consent подходит
  let i = 0;
  while (i < queue.length) {
    const evt = queue[i];
    if (allowedByConsent(evt) && gaReady) {
      sendToGa(evt);
      queue.splice(i, 1);
    } else {
      i++;
    }
  }
}

/** Публичный API */
export function track(evt: AnalyticsEvent) {
  // Если нет consent сейчас — оставляем в очереди, вдруг юзер согласится позже.
  if (!allowedByConsent(evt) || !gaReady) {
    queue.push(evt);
    return;
  }
  sendToGa(evt);
}

/** Хелпер для pageview: отправляем и стандартный 'page_view', и наш 'view_page'. */
export function trackPageView(path: string, title?: string) {
  if (GA_ID && window.gtag && getConsent().analytics) {
    window.gtag("event", "page_view", { page_title: title, page_location: location.href, page_path: path });
  }
  track({ name: "view_page", params: { path } });
}

/** Позвать при изменении consent из CookieBar */
export function onConsentChanged() {
  flushQueue();
}