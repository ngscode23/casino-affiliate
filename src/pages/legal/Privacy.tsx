import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import Seo from "@/components/Seo";

export default function PrivacyPage() {
  return (
    <>
      <Seo title="Privacy Policy — CasinoHub" description="Политика конфиденциальности CasinoHub." />
      <section className="neon-hero">
        <Section><h1 className="font-extrabold" style={{fontSize:"clamp(28px,4.5vw,46px)"}}>Privacy Policy</h1></Section>
      </section>
      <Section>
        <Card className="p-6 space-y-4 text-sm text-[var(--text-dim)]">
          <p>[TODO] Описание сбора данных, правовые основания (GDPR/DSGVO), хранение, права субъекта, cookies, контакты.</p>
        </Card>
      </Section>
    </>
  );
}
