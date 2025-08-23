// src/pages/Offers/Index.tsx
import Section from "@/components/common/section";
import Card from "@/components/common/card";
import { Link } from "react-router-dom";

export default function OffersIndex() {
  return (
    <Section className="space-y-6">
      <h1 className="text-2xl font-bold">All Offers</h1>
      <Card className="p-6 space-y-2">
        <p className="text-[var(--text-dim)]">
          Список офферов и категории — заглушка. Зайди в /compare для основного списка.
        </p>
        <Link className="underline cursor-pointer" to="/compare">→ Go to Compare</Link>
      </Card>
    </Section>
  );
}

