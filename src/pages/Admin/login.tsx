import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Section from "@/components/common/section";
import Card from "@/components/common/card";
import Button from "@/components/common/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(params.get("next") || "/admin", { replace: true });
    });
  }, [navigate, params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      navigate(params.get("next") || "/admin", { replace: true });
    }
  }

  return (
    <Section className="max-w-md p-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Password"
            type="password"
            value={pwd}
            onChange={(e)=>setPwd(e.target.value)}
          />
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Logging in…" : "Login"}
          </Button>
        </form>
      </Card>
    </Section>
  );
}