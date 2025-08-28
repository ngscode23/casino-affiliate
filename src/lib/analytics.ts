// src/lib/analytics.ts
import posthog from "posthog-js";

// --- Google Analytics ID из env
export const GA_ID: string = (import.meta.env.VITE_GA_ID as string) ?? "";

// --- Consent helpers (через <html> data-атрибуты)
export type ConsentState = { analytics: boolean; marketing: boolean };

const A_ATTR = "data-analytics-consent";
const M_ATTR = "data-marketing-consent";
const EVENT_NAME = "cookie-consent-changed";

export const trackPageView = pageview; // ← ИМЕННО ЭТОГО НЕ ХВАТАЛО

export function getConsent(): ConsentState {
  try {
    const a = document.documentElement.getAttribute(A_ATTR);
    const m = document.documentElement.getAttribute(M_ATTR);
    return {
      analytics: a === "granted",
      marketing: m === "granted",
    };
  } catch {
    return { analytics: false, marketing: false };
  }
}

export function setConsent(analytics: boolean, marketing: boolean) {
  try {
    document.documentElement.setAttribute(A_ATTR, analytics ? "granted" : "denied");
    document.documentElement.setAttribute(M_ATTR, marketing ? "granted" : "denied");
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { analytics, marketing } }));
  } catch {}
}

// --- GA ready flag
let _gaReady = false;
export function setGaReady(v: boolean) {
  _gaReady = v;
}
export function isGaReady() {
  return _gaReady;
}
export function onConsentChanged(): void {
  /* no-op пока */
}

// --- PostHog init
let phInited = false;
export function initPosthog() {
  if (phInited) return;

  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  if (!key) {
    if (import.meta.env.DEV) {
      console.warn("[analytics] VITE_POSTHOG_KEY не задан — PostHog отключён");
    }
    return;
  }

  const host =
    (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ||
    "https://app.posthog.com";

  posthog.init(key, {
    api_host: host,
    autocapture: true,
    capture_pageview: false, // SPA: шлём вручную
    persistence: "localStorage",
  });

  phInited = true;
}

// --- Track event (объединяем GA + PostHog)
export function track(name: string, params?: Record<string, any>) {
  // GA
  try {
    if (_gaReady && typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params ?? {});
    }
  } catch {}

  // PostHog
  try {
    if (!phInited) initPosthog();
    posthog.capture(name, params ?? {});
  } catch {}
}

// --- Pageview
export function pageview(path?: string) {
  // GA
  try {
    if (_gaReady && typeof window !== "undefined" && typeof window.gtag === "function" && GA_ID) {
      window.gtag("config", GA_ID, {
        page_path: path ?? location.pathname,
      });
    }
  } catch {}

  // PostHog
  try {
    if (!phInited) initPosthog();
    posthog.capture("$pageview", { path: path ?? location.pathname });
  } catch {}
}

// --- Enable / disable PostHog по согласию
let started = false;
export function enableAnalytics() {
  if (started) return;
  started = true;
  initPosthog();
}

export function disableAnalytics() {
  try {
    posthog.opt_out_capturing();
  } catch {}
}

// --- Legacy adapter: track?.({ name, params })
export const legacyTrack = (payload?: { name?: string; params?: Record<string, unknown> }) => {
  if (!payload?.name) return;
  track(payload.name, payload.params);
};

export const initAnalytics = initPosthog;
export const trackPageview = pageview;
// legacy aliases so other modules keep working
