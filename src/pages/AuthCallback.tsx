// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  useEffect(() => {
    // просто дёрнем сессию и вернём на главную
    supabase.auth.getSession().finally(() => {
      // небольшая задержка, чтобы supabase успел применить сессию
      setTimeout(() => (location.href = "/"), 300);
    });
  }, []);
  return (
    <div className="neon-container py-12">
      <div className="neon-card p-6">Signing you in…</div>
    </div>
  );
}

