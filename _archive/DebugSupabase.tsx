import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Button from "@/components/common/button";

export default function DebugSupabase() {
  const [envOk, setEnvOk] = useState(false);
  const [status, setStatus] = useState("Init...");
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    setEnvOk(Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY));

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id, email: (data.user as any).email } : null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setUser(sess?.user ? { id: sess.user.id, email: (sess.user as any).email } : null);
    });

    (async () => {
      setStatus("Query profiles...");
      const { data: p, error: pe } = await supabase.from("profiles").select("id").limit(1);
      console.log("[profiles] data:", p, "error:", pe);

      setStatus("Query favorites...");
      const { data: f, error: fe } = await supabase.from("favorites").select("offer_id").limit(1);
      console.log("[favorites] data:", f, "error:", fe);

      setStatus("Done. Check console.");
    })();

    return () => sub.subscription.unsubscribe();
  }, []);

  async function tryInsertAsMe() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return alert("Ты не залогинен. Сверху в хедере — Sign in.");

    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: auth.user.id, offer_id: "debug-offer" });

    console.log("[insert favorites as me] error:", error);
    alert(error ? `Ошибка: ${error.message}` : "OK: вставлено");
  }

  async function showSession() {
    const { data } = await supabase.auth.getSession();
    console.log("session:", data.session);
    alert(data.session ? "Session OK" : "No session");
  }

  return (
    <div className="neon-container py-8">
      <div className="neon-card p-4 space-y-3">
        <div className="text-lg font-semibold">Supabase Debug</div>
        <div>ENV present: <b>{envOk ? "YES" : "NO"}</b></div>
        <div>User: {user ? `${user.email ?? user.id}` : "anonymous"}</div>
        <div>Status: {status}</div>
        <div className="flex gap-2">
          <Button onClick={tryInsertAsMe}>Insert my favorite</Button>
          <Button variant="soft" onClick={showSession}>Show session</Button>
        </div>
        <div className="text-xs text-[var(--text-dim)]">Смотри консоль. 401 без сессии — норма.</div>
      </div>
    </div>
  );
}

