// src/pages/Home/index.tsx
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Section from "@/components/common/section";
import Seo from "@/components/Seo";
import { SITE_URL, BRAND_NAME, BRAND_LOGO } from "@/config/config";

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const term = q.trim();
      navigate(`/compare${term ? `?q=${encodeURIComponent(term)}` : ""}`);
    },
    [q, navigate]
  );

  // JSON-LD: Organization
  const orgLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: BRAND_NAME ?? "CasinoHub",
      url: SITE_URL || (typeof location !== "undefined" ? location.origin : ""),
      ...(BRAND_LOGO ? { logo: BRAND_LOGO } : {}),
    }),
    []
  );

  // JSON-LD: WebSite + SearchAction
  const siteLd = useMemo(
    () => {
      const origin = SITE_URL || (typeof location !== "undefined" ? location.origin : "");
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: origin,
        name: BRAND_NAME ?? "CasinoHub",
        potentialAction: {
          "@type": "SearchAction",
          target: `${origin}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      };
    },
    []
  );

  return (
    <>
      <Seo
        title={`${BRAND_NAME ?? "CasinoHub"} — сравнение казино, выплаты и рейтинги`}
        description="Сравнивайте казино по лицензии, скорости выплат и рейтингу. Ответственная игра 18+."
        jsonLd={[orgLd, siteLd]}
        canonical={SITE_URL}
      />

      <section className="neon-hero">
        <Section>
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

          <form
            className="neon-search mt-4"
            onSubmit={onSubmit}
            role="search"
            aria-label="Site search"
          >
            <input
              type="search"
              className="neon-input"
              placeholder="Search casinos, bonuses, licenses…"
              value={q}
              onChange={(e) => setQ(e.currentTarget.value)}
              autoComplete="off"
              aria-label="Search"
            />
            <button className="neon-btn" type="submit">Compare now</button>
          </form>
        </Section>
      </section>
    </>
  );
}