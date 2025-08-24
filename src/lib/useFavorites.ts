// src/lib/useFavorites.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { HAS_SUPABASE } from "@/config/config";

/** Строка таблицы favorites, достаточно для CRUD */
type FavoriteRow = {
  user_id: string;
  offer_id: string;
  created_at?: string;
};

const LS_KEY = "fav:v1";

/** ===== LocalStorage fallback ===== */
function getLocal(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr.filter(Boolean) as string[]) : [];
  } catch {
    return [];
  }
}

function setLocal(list: string[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

/** Публичный тип того, что возвращает хук */
export type UseFavoritesReturn = {
  items: string[];                                // список slug'ов
  /** @deprecated используй items */ 
  list: string[];                                 // алиас для совместимости со старым кодом
  isFavorite: (slug: string) => boolean;          // проверка
  /** @deprecated используй isFavorite */ 
  has: (slug: string) => boolean;                 // алиас для совместимости
  add: (slug: string) => Promise<void> | void;    // добавить
  remove: (slug: string) => Promise<void> | void; // удалить
  toggle: (slug: string) => Promise<void> | void; // переключить
  reload: () => Promise<void> | void;             // перечитать
  isLoading: boolean;
  error: string | null;
};

/**
 * Хук избранного.
 * @param userId - текущий пользователь; если нет — работает только через LocalStorage
 */
export function useFavorites(userId?: string): UseFavoritesReturn {
  const [items, setItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // начальная загрузка
  useEffect(() => {
    let cancelled = false;

    async function load(uid?: string) {
      setIsLoading(true);
      setError(null);

      if (HAS_SUPABASE && uid) {
        const { data, error } = await (supabase as any)
          .from("favorites")
          .select("offer_id")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });

        if (!cancelled) {
          if (error) {
            console.warn("[favorites] select error:", error);
            setError(error.message ?? "favorites select error");
            setItems(getLocal()); // fallback
          } else {
            setItems((data ?? []).map((r: FavoriteRow) => r.offer_id));
          }
        }
      } else {
        setItems(getLocal());
      }

      if (!cancelled) setIsLoading(false);
    }

    load(userId);
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const add = useCallback(
    async (slug: string) => {
      if (!slug) return;

      if (HAS_SUPABASE && userId) {
        const row: FavoriteRow = { user_id: userId, offer_id: slug };
        const { error } = await (supabase as any)
          .from("favorites")
          .upsert([row], { onConflict: "user_id,offer_id" });

        if (error) {
          console.warn("[favorites] upsert error:", error);
          setError(error.message ?? "favorites upsert error");
        }
        setItems((prev) => Array.from(new Set([...prev, slug])));
      } else {
        const next = Array.from(new Set([...items, slug]));
        setItems(next);
        setLocal(next);
      }
    },
    [items, userId]
  );

  const remove = useCallback(
    async (slug: string) => {
      if (!slug) return;

      if (HAS_SUPABASE && userId) {
        const { error } = await (supabase as any)
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("offer_id", slug);

        if (error) {
          console.warn("[favorites] delete error:", error);
          setError(error.message ?? "favorites delete error");
        }
        setItems((prev) => prev.filter((x) => x !== slug));
      } else {
        const next = items.filter((x) => x !== slug);
        setItems(next);
        setLocal(next);
      }
    },
    [items, userId]
  );

  const toggle = useCallback(
    async (slug: string) => {
      if (items.includes(slug)) {
        await remove(slug);
      } else {
        await add(slug);
      }
    },
    [items, add, remove]
  );

  const isFavorite = useCallback((slug: string) => items.includes(slug), [items]);

  const reload = useCallback(async () => {
    if (HAS_SUPABASE && userId) {
      const { data, error } = await (supabase as any)
        .from("favorites")
        .select("offer_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("[favorites] reload error:", error);
        setError(error.message ?? "favorites reload error");
      }
      setItems((data ?? []).map((r: FavoriteRow) => r.offer_id));
    } else {
      setItems(getLocal());
    }
  }, [userId]);

  return {
    items,
    list: items,        // алиас для старого кода
    isFavorite,
    has: isFavorite,    // алиас для старого кода
    add,
    remove,
    toggle,
    reload,
    isLoading,
    error,
  };
}