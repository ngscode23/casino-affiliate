import Section from "@/components/common/section";
import Card from "@/components/common/card";
import Seo from "@/components/Seo";

export default function CookiesPage() {
  return (
    <>
      <Seo title="Cookie Policy — CasinoHub" description="Политика Cookie и настройки согласия." />
      <section className="neon-hero">
        <Section><h1 className="font-extrabold" style={{fontSize:"clamp(28px,4.5vw,46px)"}}>Cookie Policy</h1></Section>
      </section>
      <Section>
        <Card className="p-6 space-y-4 text-sm text-[var(--text-dim)]">
          <p>[TODO] Категории cookies: necessary / analytics / marketing. Сроки хранения. Ссылка на настройки внизу сайта.</p>
        </Card>
      </Section>
    </>
  );
}


