// src/lib/useFavorites.ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const LS = "fav:v1";

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(LS);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.filter((x): x is string => typeof x === "string")
        : [];
    } catch {
      return [];
    }
  });

  // локальный кэш
  useEffect(() => {
    try {
      localStorage.setItem(LS, JSON.stringify(ids));
    } catch {
      /* noop */
    }
  }, [ids]);

  // однократно при маунте: ensure profile + загрузка и merge избранного
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth.user;
        if (!user || cancelled) return;

        // гарантируем профиль без 409
        await supabase
          .from("profiles")
          .upsert({ id: user.id }, { onConflict: "id", ignoreDuplicates: true });

        const { data, error } = await supabase
          .from("favorites")
          .select("offer_id")
          .eq("user_id", user.id);

        if (error || cancelled) return;

        const remote = (data ?? []).map((r: { offer_id: string }) => r.offer_id);
        const merged = Array.from(new Set([...ids, ...remote]));
        setIds(merged);

        // докидываем недостающие на сервер
        const toPush = merged
          .filter((id) => !remote.includes(id))
          .map((offer_id) => ({ user_id: user.id, offer_id }));

        if (toPush.length) {
          await supabase.from("favorites").insert(toPush);
        }
      } catch {
        // оффлайн — живём на локалсторадже
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    async (id: string) => {
      const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
      setIds(next);

      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth.user;
        if (!user) return;

        if (next.includes(id)) {
          await supabase.from("favorites").insert({ user_id: user.id, offer_id: id });
        } else {
          await supabase.from("favorites").delete().match({ user_id: user.id, offer_id: id });
        }
      } catch {
        // локально уже обновили; при следующем онлайне синкнется
      }
    },
    [ids]
  );

  const clear = useCallback(async () => {
    setIds([]);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (user) {
        await supabase.from("favorites").delete().eq("user_id", user.id);
      }
    } catch {
      /* noop */
    }
  }, []);

  return { ids, has, toggle, clear };
}

