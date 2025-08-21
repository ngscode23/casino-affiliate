// src/lib/analytics.ts
export type EventPayloads = {
  // клики/действия
  click_play:    { id: string };
  add_compare:   { id: string };
  remove_compare:{ id: string };
  copy_bonus:    { code: string };

  // доп. события (то, чего не хватало)
  offer_click:   { slug: string; name: string };
  compare_open:  { count: number };
  favorite_add:  { slug: string };
  favorite_remove:{ slug: string };
};

export type EventName = keyof EventPayloads;

/** Универсальный трекер с мягкой интеграцией в разные аналитики */
export function track<E extends EventName>(event: E, payload: EventPayloads[E]): void {
  try {
    if (typeof window !== "undefined") {
      // Dev-лог
      if (import.meta.env?.MODE !== "production") {
        // eslint-disable-next-line no-console
        console.log("[track]", event, payload);
      }

      // Google Tag Manager (dataLayer)
      // @ts-expect-error необязательно типизировано
      window.dataLayer?.push?.({ event, ...payload });

      // GA4
      // @ts-expect-error gtag может отсутствовать
      window.gtag?.("event", event, payload);

      // Plausible
      // @ts-expect-error plausible может отсутствовать
      window.plausible?.(event, { props: payload });

      // Umami
      // @ts-expect-error umami может отсутствовать
      window.umami?.track?.(event, payload);
    }
  } catch {
    // гасим любые сбои аналитики, чтобы не ломать UI
  }
}

// Удобные хелперы (по желанию)
export const analytics = {
  play:          (id: string)                   => track("click_play",     { id }),
  offerClick:    (slug: string, name: string)   => track("offer_click",    { slug, name }),
  addCompare:    (id: string)                   => track("add_compare",    { id }),
  removeCompare: (id: string)                   => track("remove_compare", { id }),
  compareOpen:   (count: number)                => track("compare_open",   { count }),
  favoriteAdd:   (slug: string)                 => track("favorite_add",   { slug }),
  favoriteRemove:(slug: string)                 => track("favorite_remove",{ slug }),
};