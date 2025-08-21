export function upsertJsonLd(id: string, data: unknown) {
  const tagId = `jsonld-${id}`;
  let el = document.head.querySelector<HTMLScriptElement>(`#${tagId}`);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = tagId;
    document.head.appendChild(el);
  }
  el.text = JSON.stringify(data);
  return () => el && el.remove();
}
















