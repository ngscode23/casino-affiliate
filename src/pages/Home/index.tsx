// src/pages/Home.tsx
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import OrgJsonLd from "@/components/OrgJsonLd";
import SiteJsonLd from "@/components/SiteJsonLd";
import { SITE_URL, BRAND_NAME, BRAND_LOGO } from "@/config/config";

export default function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // сюда можно вести на /compare или на /offers — выбери маршрут под свой поиск
      navigate(`/compare?q=${encodeURIComponent(q.trim())}`);
    },
    [q, navigate]
  );

  // JSON-LD данные
  const orgLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: BRAND_NAME ?? "CasinoHub",
      url: SITE_URL,
      ...(BRAND_LOGO ? { logo: BRAND_LOGO } : {}),
    }),
    []
  );

  const siteLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: SITE_URL,
      name: BRAND_NAME ?? "CasinoHub",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    }),
    []
  );

  return (
    <>
      {/* Вставляем JSON-LD */}
      <OrgJsonLd data={orgLd} />
      <SiteJsonLd data={siteLd} />

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
          <p className="neon-subline">
            Compare top casinos, find exclusive bonuses, and withdraw faster.
          </p>

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
    </>
  );
}


