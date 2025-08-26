import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { HAS_SUPABASE } from "@/config/config";

/** LS-ключи */
const LS_KEY = "fav:v1";
const LS_OLD = "favorites";

/** Шина событий для синхронизации всех экземпляров хука */
const bus = new EventTarget();

/** Глобальный кэш (общий для всех инстансов) */
let cache: string[] = [];

/* ---------- helpers ---------- */

function readLocal(): string[] {
  try {
    const cur = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    const old = JSON.parse(localStorage.getItem(LS_OLD) || "[]");

    const curArr = Array.isArray(cur) ? cur.filter(Boolean) : [];
    const oldArr = Array.isArray(old) ? old.filter(Boolean) : [];

    if (curArr.length === 0 && oldArr.length > 0) {
      const merged = Array.from(new Set(oldArr));
      localStorage.setItem(LS_KEY, JSON.stringify(merged));
      // опционально чистим старое хранилище:
       localStorage.removeItem(LS_OLD);
      return merged;
    }
    return curArr;
  } catch {
    return [];
  }
}

function setCache(next: string[]) {
  cache = Array.from(new Set(next));
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
  bus.dispatchEvent(new CustomEvent("fav:update", { detail: cache }));
}

/* Инициализация кэша и синк по событию браузера */
if (typeof window !== "undefined") {
  if (cache.length === 0) cache = readLocal();
  window.addEventListener("storage", (e) => {
    if (e.key === LS_KEY) setCache(readLocal());
  });
}

/* ---------- API типов ---------- */

export type UseFavoritesReturn = {
  items: string[];
  isFavorite: (slug: string) => boolean;

  /** Возвращают НОВОЕ состояние для этого slug */
  add: (slug: string) => boolean;
  remove: (slug: string) => boolean;
  toggle: (slug: string) => boolean;

  clear: () => void;
  isLoading: boolean;
  error: string | null;
};

/* ---------- Хук ---------- */

export function useFavorites(userId?: string): UseFavoritesReturn {
  const [items, setItems] = useState<string[]>(cache);
  const [isLoading, setIsLoading] = useState<boolean>(!!(HAS_SUPABASE && userId));
  const [error, setError] = useState<string | null>(null);

  // подписка на глобальные обновления
  useEffect(() => {
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      if (Array.isArray(detail)) setItems(detail);
    };
    bus.addEventListener("fav:update", onUpdate);
    return () => bus.removeEventListener("fav:update", onUpdate);
  }, []);

  // первичная загрузка с сервера (если есть userId)
  useEffect(() => {
    if (!HAS_SUPABASE || !userId) {
      setItems(cache);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const { data, error } = await (supabase as any)
          .from("favorites")
          .select("offer_id")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (cancelled) return;
        if (error) {
          console.warn("[favorites] select error:", error);
          setError(error.message ?? "favorites select error");
          setItems(cache); // оставляем локальные
        } else {
          const remote: string[] = (data ?? []).map((r: { offer_id: string }) => r.offer_id);
          setCache(remote); // обновит всех подписчиков
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isFavorite = useCallback((slug: string) => cache.includes(slug), []);

  const add = useCallback(
    (slug: string): boolean => {
      if (!slug) return false;
      if (cache.includes(slug)) return true;

      const next = [...cache, slug];
      setCache(next);

      if (HAS_SUPABASE && userId) {
        (async () => {
          const { error } = await (supabase as any)
            .from("favorites")
            .upsert([{ user_id: userId, offer_id: slug }], { onConflict: "user_id,offer_id" });
          if (error) {
            console.warn("[favorites] upsert error:", error);
            setError(error.message ?? "favorites upsert error");
          }
        })();
      }
      return true;
    },
    [userId]
  );

  const remove = useCallback(
    (slug: string): boolean => {
      if (!slug) return false;
      if (!cache.includes(slug)) return false;

      const next = cache.filter((x) => x !== slug);
      setCache(next);

      if (HAS_SUPABASE && userId) {
        (async () => {
          const { error } = await (supabase as any)
            .from("favorites")
            .delete()
            .eq("user_id", userId)
            .eq("offer_id", slug);
          if (error) {
            console.warn("[favorites] delete error:", error);
            setError(error.message ?? "favorites delete error");
          }
        })();
      }
      return false;
    },
    [userId]
  );

  const toggle = useCallback(
    (slug: string): boolean => {
      if (!slug) return false;
      return cache.includes(slug) ? remove(slug) : add(slug);
    },
    [add, remove]
  );

  const clear = useCallback(() => setCache([]), []);

  return useMemo(
    () => ({ items, isFavorite, add, remove, toggle, clear, isLoading, error }),
    [items, isFavorite, add, remove, toggle, clear, isLoading, error]
  );
}

