// src/pages/Home.tsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/compare?q=${encodeURIComponent(query)}` : "/compare");
  }, [q, navigate]);

  return (
    <section className="neon-hero">
      <div className="neon-container">
        {/* бейджи */}
        <div className="mb-4 flex items-center gap-2">
          <span className="neon-chip" data-glow>5000+ Offers</span>
          <span className="neon-chip" data-glow>Real reviews</span>
          <span className="neon-chip" data-glow>Fast payouts</span>
        </div>

        <h1 className="font-extrabold" style={{ fontSize: "clamp(22px, 6vw, 46px)" }}>
          The Leading Casino Affiliate Platform
        </h1>
        <p className="neon-subline">Compare top casinos, find exclusive bonuses, and withdraw faster.</p>

        <form className="neon-search" onSubmit={onSubmit} role="search" aria-label="Site search">
          <input
            type="search"
            className="neon-input"
            placeholder="Search casinos, bonuses, licenses…"
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            autoComplete="off"
          />
          <button className="neon-btn" type="submit">Compare now</button>
        </form>
      </div>
    </section>
  );
}
