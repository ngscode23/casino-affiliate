import { usePageView } from "@/lib/usePageView";

// Отдельный компонент, чтобы вызываться внутри Router
export function PageViewTracker() {
  usePageView();
  return null;
}

