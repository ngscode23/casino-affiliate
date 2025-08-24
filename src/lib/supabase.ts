// src/lib/supabase.ts (проверь имена констант у себя)
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, HAS_SUPABASE } from "@/config/config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const hasSupabase =
  /^https?:\/\/.+\.supabase\.co$/i.test(SUPABASE_URL) && !!SUPABASE_ANON_KEY;

let _client: SupabaseClient | null = null;
let client: SupabaseClient | null = null;
if (hasSupabase) {
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true },
  });
} else {
  console.warn("[supabase] Missing/invalid env, using local fallback.");
}
if (HAS_SUPABASE) {
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true } });
} else {
  console.warn("[supabase] disabled (missing env)");
}

export function getSupabase(): SupabaseClient | null {
  return _client;
}






