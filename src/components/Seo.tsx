import { useEffect } from "react";



type Og = Partial<Record<"title"|"description"|"type"|"url"|"image", string>>;
type Tw = Partial<Record<"card"|"title"|"description"|"image", string>>;

type Props = {
  title?: string;
  description?: string;
  noIndex?: boolean;
  jsonLd?: object; // structured data
};

function upsertMeta(attr: "name"|"property", key: string, content?: string) {
  if (!content) return () => {};
  const sel = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
  return () => el && el.remove();
}

// src/components/Seo.tsx


export default function Seo({ title, description, noIndex, jsonLd }: Props) {
  useEffect(() => {
    if (title) document.title = title;
    const metaDesc = ensureMeta("description");
    if (description) metaDesc.setAttribute("content", description);
    ensureMeta("og:title").setAttribute("content", title ?? "");
    ensureMeta("og:description").setAttribute("content", description ?? "");
    ensureMeta("twitter:card").setAttribute("content", "summary_large_image");
    if (noIndex) ensureMeta("robots").setAttribute("content", "noindex,nofollow");
  }, [title, description, noIndex]);

  return jsonLd ? (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  ) : null;
}

function ensureMeta(name: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  return el;
}
