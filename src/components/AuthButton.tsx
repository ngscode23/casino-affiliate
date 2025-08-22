// src/components/AuthButton.tsx
import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function AuthButton() {
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setUserEmail(sess?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const redirectTo = window.location.origin; // должен быть разрешён в Auth settings
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) setErr(error.message);
    else setSent(true);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (userEmail) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-dim)] truncate max-w-[140px]" title={userEmail}>
          {userEmail}
        </span>
        <Button variant="soft" onClick={signOut}>Sign out</Button>
      </div>
    );
  }

  return (
    <form onSubmit={signIn} className="flex items-center gap-2">
      <input
        className="neon-input h-9 w-48"
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit">Sign in</Button>
      {sent && <span className="text-xs text-[var(--text-dim)]">Check inbox</span>}
      {err && <span className="text-xs text-red-400">{err}</span>}
    </form>
  );
}