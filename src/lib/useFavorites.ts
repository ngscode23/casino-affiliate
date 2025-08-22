// src/lib/useFavorites.ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const LS = "fav:v1";

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(LS);
      return raw ? (JSON.parse(raw) as string[]) : [];
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

  // при маунте: если юзер залогинен — тянем удаленные фавориты, мержим, недостающие пушим
  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth.user;
        if (!user || stop) return;

        // гарантируем профиль (не упадет при конфликте из-за RLS/PK)
        try {
          await supabase.from("profiles").insert({ id: user.id });
        } catch {
          /* может быть conflict — ок */
        }

        const { data, error } = await supabase
          .from("favorites")
          .select("offer_id")
          .eq("user_id", user.id);

        if (error || stop) return;

        const remote = (data ?? []).map((r: { offer_id: string }) => r.offer_id);
        const merged = Array.from(new Set([...ids, ...remote]));
        setIds(merged);

        const toPush = merged
          .filter((id) => !remote.includes(id))
          .map((offer_id) => ({ user_id: user.id, offer_id }));

        if (toPush.length) {
          await supabase.from("favorites").insert(toPush);
        }
      } catch {
        // оффлайн/сетевые — живём на локалсторадже
      }
    })();

    return () => {
      stop = true;
    };
    // только при маунте
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
        // ок — локально уже применили. потом синкнется.
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