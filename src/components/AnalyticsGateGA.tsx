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

    // dataLayer + gtag без 'arguments'
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: any[]) => {
      window.dataLayer!.push(args);
    };

    // DEFAULT CONSENT (advanced): всё denied до выбора
    window.gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });

    // gtag.js
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);

    // GA config
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });

    // слушаем апдейт из CookieBar
    const onConsent = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      const analytics = !!d.analytics;
      const marketing = !!d.marketing;
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