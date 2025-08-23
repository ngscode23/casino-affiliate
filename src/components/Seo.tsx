// src/components/Seo.tsx
import { useEffect, useMemo } from "react";

type Props = {
  title?: string;
  description?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
};

function upsertMeta(attr: "name" | "property", key: string, content?: string | null) {
  const sel = `meta[${attr}="${key}"]`;
  const head = document.head;
  const prev = head.querySelector<HTMLMetaElement>(sel);

  if (!content) {
    if (prev) head.removeChild(prev);
    return;
  }
  let el = prev;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href?: string | null) {
  const head = document.head;
  let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    if (link) head.removeChild(link);
    return;
  }
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    head.appendChild(link);
  }
  link.href = href;
}

export default function Seo({
  title,
  description,
  noIndex,
  jsonLd,
  ogImage,
  ogUrl,
  canonical,
}: Props) {
  // стабильная строка, чтобы не ругался линтер в deps
  const jsonLdText = useMemo(() => (jsonLd ? JSON.stringify(jsonLd) : null), [jsonLd]);

  useEffect(() => {
    // title
    if (title) document.title = title;

    // базовые мета
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noIndex ? "noindex,nofollow" : null);

    // OG / Twitter
    upsertMeta("property", "og:title", title ?? null);
    upsertMeta("property", "og:description", description ?? null);
    upsertMeta("property", "og:url", ogUrl ?? null);
    upsertMeta("property", "og:image", ogImage ?? null);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title ?? null);
    upsertMeta("name", "twitter:description", description ?? null);
    upsertMeta("name", "twitter:image", ogImage ?? null);

    // canonical
    upsertCanonical(canonical ?? null);
  }, [title, description, noIndex, ogUrl, ogImage, canonical]);

  // JSON-LD с корректным cleanup
  useEffect(() => {
    if (!jsonLdText) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "jsonld-page"; // стабильный id, чтобы не плодить теги
    el.text = jsonLdText;

    // удаляем старый, если был
    const prev = document.getElementById(el.id);
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);

    document.head.appendChild(el);

    return () => {
      const cur = document.getElementById(el.id);
      if (cur && cur.parentNode) cur.parentNode.removeChild(cur);
    };
  }, [jsonLdText]);

  return null;
}

