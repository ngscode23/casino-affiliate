export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Куда вернёт magic-link; в Netlify задаём VITE_AUTH_CALLBACK,
// локально можно не задавать — возьмём /auth/callback текущего origin
// src/config.ts
export const AUTH_CALLBACK =
  import.meta.env.MODE === "development"
    ? "http://localhost:5173/"
    : "https://glistening-caramel-88a555.netlify.app/";