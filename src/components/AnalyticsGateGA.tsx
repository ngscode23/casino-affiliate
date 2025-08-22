// src/components/AnalyticsGateGA.tsx
import { useEffect } from "react";

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default function AnalyticsGateGA() {
  useEffect(() => {
    if (!GA_ID) return;

    // dataLayer + gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer!.push(arguments); };

    // 1) DEFAULT CONSENT (advanced): всё denied пока пользователь не выбрал
    window.gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500, // небольшая задержка инициализации
    });

    // 2) подключаем gtag.js
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);

    // 3) конфиг GA
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });

    // 4) слушаем событие из CookieBar и обновляем consent
    const onConsent = (e: Event) => {
      // detail: { analytics: boolean, marketing: boolean, ... }
      const detail = (e as CustomEvent).detail || {};
      const analytics = !!detail.analytics;
      const marketing = !!detail.marketing;

      window.gtag!("consent", "update", {
        analytics_storage: analytics ? "granted" : "denied",
        ad_storage:        marketing ? "granted" : "denied",
        ad_user_data:      marketing ? "granted" : "denied",
        ad_personalization:marketing ? "granted" : "denied",
      });
    };
    window.addEventListener("cookie-consent", onConsent);

    return () => window.removeEventListener("cookie-consent", onConsent);
  }, []);

  return null;
}