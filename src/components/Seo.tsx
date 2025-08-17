import { useEffect } from "react";

export function Seo({ title, desc }: { title: string; desc: string }) {
  useEffect(() => {
    document.title = title;
    let m = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);
  }, [title, desc]);
  return null;
}