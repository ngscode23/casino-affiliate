import Seo from "@/components/Seo";
import Section from "@/components/common/section";

export default function ResponsibleGaming() {
  return (
    <>
      <Seo title="Responsible Gaming" description="Help and resources for safer play." />
      <Section className="prose prose-invert max-w-none">
        <h1>Responsible Gaming</h1>
        <p>18+ only. If gambling stops being fun, seek help. Set limits and take breaks.</p>
        <ul>
          <li>Links to local help lines</li>
          <li>Self-exclusion info from operators</li>
        </ul>
      </Section>
    </>
  );
}
