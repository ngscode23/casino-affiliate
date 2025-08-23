import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Seo from "@/components/Seo";

export default function ResponsibleGamingPage() {
  return (
    <>
      <Seo title="Responsible Gaming — CasinoHub" description="Играйте ответственно. Помощь и ресурсы." />
      <section className="neon-hero">
        <Section><h1 className="font-extrabold" style={{fontSize:"clamp(28px,4.5vw,46px)"}}>Responsible Gaming</h1></Section>
      </section>
      <Section>
        <Card className="p-6 space-y-4 text-sm text-[var(--text-dim)]">
          <p>[TODO] Ресурсы помощи: GamCare, BeGambleAware, самооценка, советы по лимитам.</p>
        </Card>
      </Section>
    </>
  );
}
