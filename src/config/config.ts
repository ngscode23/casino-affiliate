// src/config.ts

// Базовый URL сайта (для OG, hreflang, callback и т.п.)
export const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173");

// Бренд (поменяй под себя)
export const BRAND_NAME = "CasinoHub";
export const BRAND_LOGO = "/logo.svg";

// GA4 (может быть пустым — тогда аналитика не активируется)
export const GA_ID = import.meta.env.VITE_GA_ID || "";

// === Supabase (ТОЛЬКО public anon key, НЕ service_role!) ===
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Куда вернётся магическая ссылка авторизации
export const AUTH_CALLBACK = `${SITE_URL}/auth/callback`;

// Небольшая проверка в рантайме (поможет не искать потом почему 401)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // не бросаем ошибку на проде, но явно подсвечиваем проблему
   
  console.warn(
    "[config] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — Supabase auth/sync will not work."
  );
}

