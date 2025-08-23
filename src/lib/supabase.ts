// src/lib/supabase.ts (проверь имена констант у себя)
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/config/config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);