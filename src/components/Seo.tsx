// src/components/Seo.tsx
import { useEffect, useMemo } from "react";

type Props = {
  title?: string;
  description?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
  ogImage?: string;
  ogUrl?: string;
};

function upsertMetaByName(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaByProp(prop: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function Seo({
  title,
  description,
  noIndex,
  jsonLd,
  ogImage,
  ogUrl,
}: Props) {
  // стабильная строка для эффекта, чтобы линтер не ныл
  const jsonLdText = useMemo(() => (jsonLd ? JSON.stringify(jsonLd) : null), [jsonLd]);

  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      upsertMetaByName("description", description);
      upsertMetaByProp("og:description", description);
      upsertMetaByName("twitter:description", description);
    }

    if (title) {
      upsertMetaByProp("og:title", title);
      upsertMetaByName("twitter:title", title);
    }

    // базовый twitter card
    upsertMetaByName("twitter:card", "summary_large_image");

    if (ogImage) {
      upsertMetaByProp("og:image", ogImage);
      upsertMetaByName("twitter:image", ogImage);
    }

    if (ogUrl) {
      upsertMetaByProp("og:url", ogUrl);
    }

    if (noIndex) {
      upsertMetaByName("robots", "noindex,nofollow");
    }
  }, [title, description, noIndex, ogImage, ogUrl]);

  // вставка JSON-LD со снятием при размонтировании/обновлении
  useEffect(() => {
    if (!jsonLdText) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.text = jsonLdText;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, [jsonLdText]);

  return null;
}