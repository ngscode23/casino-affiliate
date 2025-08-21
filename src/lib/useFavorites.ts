import { useEffect, useState } from "react";
const KEY = "cw:favorites";

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {}
  }, [ids]);

  const has = (id: string) => ids.includes(id);
  const toggle = (id: string) => setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const clear = () => setIds([]);

  return { ids, has, toggle, clear };
}
















