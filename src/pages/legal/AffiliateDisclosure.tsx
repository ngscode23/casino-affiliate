import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Seo from "@/components/Seo";

export default function AffiliateDisclosurePage() {
  return (
    <>
      <Seo title="Affiliate Disclosure — CasinoHub" description="Раскрытие аффилированности." />
      <section className="neon-hero">
        <Section><h1 className="font-extrabold" style={{fontSize:"clamp(28px,4.5vw,46px)"}}>Affiliate Disclosure</h1></Section>
      </section>
      <Section>
        <Card className="p-6 space-y-4 text-sm text-[var(--text-dim)]">
          <p>Мы можем получать комиссию за переходы по ссылкам и регистрации. Это не влияет на наши оценки.</p>
        </Card>
      </Section>
    </>
  );
}
