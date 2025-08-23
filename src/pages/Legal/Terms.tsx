import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Seo from "@/components/Seo";

export default function TermsPage() {
  return (
    <>
      <Seo title="Terms of Service — CasinoHub" description="Пользовательское соглашение CasinoHub." />
      <section className="neon-hero">
        <Section><h1 className="font-extrabold" style={{fontSize:"clamp(28px,4.5vw,46px)"}}>Terms of Service</h1></Section>
      </section>
      <Section>
        <Card className="p-6 space-y-4 text-sm text-[var(--text-dim)]">
          <p>[TODO] Условия пользования, ограничения, ответственность, изменения условий.</p>
        </Card>
      </Section>
    </>
  );
}
