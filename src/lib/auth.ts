// src/lib/auth.ts
import { supabase } from "./supabase";
export async function signIn(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin }
  });
  if (error) throw error;
}
export const signOut = () => supabase.auth.signOut();
export const getUser = async () => (await supabase.auth.getUser()).data.user;

