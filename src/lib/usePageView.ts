// src/lib/usePageView.ts
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

export function usePageView() {
  const { pathname, search } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Игнорируем POP? Обычно не нужно: считаем и back/forward.
    const path = `${pathname}${search}`;
    trackPageView(path, document.title);
  }, [pathname, search, navType]);
}

