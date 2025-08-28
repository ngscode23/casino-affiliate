// ЕДИНСТВЕННАЯ точка создания клиента
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, HAS_SUPABASE } from "@/config/config";

declare global {
  interface Window {
    __supabase?: ReturnType<typeof createClient>;
  }
}

const storageKey = "sb-casino-affiliate-auth"; // свой ключ вместо дефолтного
const url  = import.meta.env.VITE_SUPABASE_URL!;
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY!;


// В dev из-за HMR модуль может переоцениваться — кешируем на window.
const client =
  (typeof window !== "undefined" && window.__supabase) ||
  (HAS_SUPABASE
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          // уникальный ключ — если вдруг всё же будет второй клиент, он не конфликтнёт
          storageKey,
        },
      })
    : undefined);

if (typeof window !== "undefined" && client) {
  window.__supabase = client;
}

export const supabase = createClient(url, key);


