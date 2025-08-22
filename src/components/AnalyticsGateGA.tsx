// src/components/AnalyticsGateGA.tsx
import { useEffect } from "react";
import { getCookie } from "@/lib/cookies";

// GA4 ID берём из env, чтобы не хардкодить
const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

export default function AnalyticsGateGA() {
  useEffect(() => {
    if (!GA_ID) return;

    // Подключаем только при согласии на аналитику
    const hasConsent =
      getCookie("cc_analytics") === "1" ||
      document.documentElement.getAttribute("data-analytics-consent") === "granted";

    if (!hasConsent) {
      // если пользователь даст согласие позже — перезапустим инициализацию
      const handler = (e: Event) => {
        const detail = (e as CustomEvent).detail || {};
        if (detail.analytics === true) {
          location.reload();
        }
      };
      window.addEventListener("cookie-consent", handler as EventListener);
      return () => window.removeEventListener("cookie-consent", handler as EventListener);
    }

    // gtag bootstrap
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag("js", new Date());
    gtag("config", GA_ID);

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);

    return () => {
      s.remove();
    };
  }, []);

  return null;
}