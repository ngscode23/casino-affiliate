// src/components/AnalyticsGateGA.tsx
import { useEffect } from "react";
import { GA_ID, setGaReady, getConsent, onConsentChanged } from "@/lib/analytics";

export function AnalyticsGateGA() {
  useEffect(() => {
    function initGa() {
      if (!GA_ID) return;

      // Только если разрешена аналитика
      const c = getConsent();
      if (!c.analytics) {
        setGaReady(false);
        return;
      }

      if (!window.dataLayer) window.dataLayer = [];
      if (!window.gtag) {
        window.gtag = function gtag() {
          // eslint-disable-next-line prefer-rest-params
          window.dataLayer!.push(arguments);
        };
      }

      window.gtag("js", new Date());
      window.gtag("config", GA_ID, {
        anonymize_ip: true,
        send_page_view: false // SPA: сами шлём page_view
      });

      setGaReady(true);
      onConsentChanged(); // возможно есть очередь
    }

    initGa();

    // Подпишемся на событие, которое должен диспатчить CookieBar при изменении согласия
    const handler = () => {
      initGa();
      onConsentChanged();
    };
    window.addEventListener("cookie-consent-changed", handler);
    return () => window.removeEventListener("cookie-consent-changed", handler);
  }, []);

  return null;
}
export default AnalyticsGateGA;