// src/config/config.ts
export const SITE_NAME = "CasinoHub";
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:4173")
).toString().replace(/\/+$/, "");

export const BRAND_NAME = "CasinoHub";
export const BRAND_LOGO = "/logo.svg";
export const GA_ID = (import.meta.env.VITE_GA_ID ?? "").trim();

const RAW_SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
export const SUPABASE_URL = RAW_SUPABASE_URL.replace(/\/+$/, "");
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

export const AUTH_CALLBACK_URL = `${SITE_URL}/auth/callback`;

export const HAS_SUPABASE =
  /^https?:\/\/.+\.supabase\.co$/i.test(SUPABASE_URL) && !!SUPABASE_ANON_KEY;

if (!HAS_SUPABASE) {
  console.warn("[config] VITE_SUPABASE_URL/KEY не заданы или некорректны — Supabase-фичи будут отключены.");
}

