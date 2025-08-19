import Section from "../ui/Section";
import Button from "../ui/Button";
import Chip from "../ui/Chip";

export function HomeHero() {
  return (
    <section className="neon-hero">
      <Section>
        <div className="flex items-center gap-2 mb-4">
          <Chip>500+ Offers</Chip><Chip>Real Reviews</Chip><Chip>Fast Payouts</Chip>
        </div>
        <h1 style={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(28px,4.5vw,46px)" }}>
          The Leading Casino Affiliate Platform
        </h1>
        <p className="neon-subline">Compare top casinos, find exclusive bonuses, and withdraw faster.</p>
        <div className="neon-search">
          <input className="neon-input" placeholder="Search casinos, bonuses, licenses…" />
          <Button>Compare now</Button>
        </div>
      </Section>
    </section>
  );
}
export default HomeHero;