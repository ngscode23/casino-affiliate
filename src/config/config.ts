// src/config.ts

// Базовый URL сайта (для OG, hreflang, callback и т.п.)
export const SITE_NAME = "CasinoHub";
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173")
).toString().replace(/\/+$/, ""); // без хвостового "/"

// Бренд (поменяй под себя)
export const BRAND_NAME = "CasinoHub";
export const BRAND_LOGO = "/logo.svg";

/** Аналитика (опционально) */
export const GA_ID = (import.meta.env.VITE_GA_ID ?? "").trim();

/** Supabase (public anon key И URL без завершающего '/') */
const RAW_SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
export const SUPABASE_URL = RAW_SUPABASE_URL.replace(/\/+$/, "");
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

/** Куда вернётся магическая ссылка */
export const AUTH_CALLBACK_URL = `${SITE_URL}/auth/callback`;

/** Флаг: сконфигурирован ли Supabase */
export const HAS_SUPABASE =
  /^https?:\/\/.+\.supabase\.co$/i.test(SUPABASE_URL) && !!SUPABASE_ANON_KEY;

if (!HAS_SUPABASE) {
  console.warn(
    "[config] VITE_SUPABASE_URL/KEY не заданы или некорректны — Supabase-фичи будут отключены."
  );
}

