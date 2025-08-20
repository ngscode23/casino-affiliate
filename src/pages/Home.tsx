// src/pages/Home.tsx
export default function Home() {
  return (
    <>
      <section className="neon-hero">
        <div className="neon-container">
          <div className="mb-4 flex items-center gap-2">
            <span className="neon-chip" data-glow>500+ Offers</span>
            <span className="neon-chip" data-glow>Real reviews</span>
            <span className="neon-chip" data-glow>Fast payouts</span>
          </div>
          <h1 className="font-extrabold" style={{ fontSize: "clamp(22px, 6vw, 46px)" }}>
            The Leading Casino Affiliate Platform
          </h1>
          <p className="neon-subline">Compare top casinos, find exclusive bonuses, and withdraw faster.</p>
          <div className="neon-search">
            <input className="neon-input" placeholder="Search casinos, bonuses, licenses…" />
            <button className="neon-btn">Compare now</button>
          </div>
        </div>
      </section>
    </>
  );
}