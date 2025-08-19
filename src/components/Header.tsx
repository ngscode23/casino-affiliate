
import Section from "../ui/Section";
import Button from "../ui/Button";
import Chip from "../ui/Chip";

export function Header() {
  return (
    <header className="py-4">
      <Section className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="neon-chip">CasinoHub</div>
          <Chip>Trusted 4.8★</Chip>
        </div>
        <nav className="flex items-center gap-3">
          <a href="#offers" className="text-[var(--text-dim)] hover:underline">Offers</a>
          <a href="#compare" className="text-[var(--text-dim)] hover:underline">Compare</a>
          <Button>Sign Up</Button>
        </nav>
      </Section>
    </header>
  );
}
export default Header;