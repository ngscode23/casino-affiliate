import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// удобная отладка в консоли
if (typeof window !== "undefined") (window as any).sb = supabase;

