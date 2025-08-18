import { useEffect } from "react";

type Og = Partial<Record<"title"|"description"|"type"|"url"|"image", string>>;
type Tw = Partial<Record<"card"|"title"|"description"|"image", string>>;

type Props = { title?: string; description?: string; canonical?: string; og?: Og; twitter?: Tw; };

function upsertMeta(attr: "name"|"property", key: string, content?: string) {
  if (!content) return () => {};
  const sel = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
  return () => el && el.remove();
}

export default function Seo({ title, description, canonical, og, twitter }: Props) {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const prevTitle = document.title;
    if (title) document.title = title;
    if (description) cleanups.push(upsertMeta("name","description",description));
    if (canonical) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
      link.href = canonical; cleanups.push(() => link && link.remove());
    }
    if (og) {
      if (og.title)       cleanups.push(upsertMeta("property","og:title", og.title));
      if (og.description) cleanups.push(upsertMeta("property","og:description", og.description));
      if (og.type)        cleanups.push(upsertMeta("property","og:type", og.type));
      if (og.url)         cleanups.push(upsertMeta("property","og:url", og.url));
      if (og.image)       cleanups.push(upsertMeta("property","og:image", og.image));
    }
    if (twitter) {
      if (twitter.card)        cleanups.push(upsertMeta("name","twitter:card", twitter.card));
      if (twitter.title)       cleanups.push(upsertMeta("name","twitter:title", twitter.title));
      if (twitter.description) cleanups.push(upsertMeta("name","twitter:description", twitter.description));
      if (twitter.image)       cleanups.push(upsertMeta("name","twitter:image", twitter.image));
    }
    return () => { document.title = prevTitle; cleanups.forEach(fn => { try { fn(); } catch {} }); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, canonical, JSON.stringify(og), JSON.stringify(twitter)]);
  return null;
}