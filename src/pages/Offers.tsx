// src/pages/Offers.tsx
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import Section from "@/components/ui/section";
import Card from "@/components/ui/card";
import { FavControl } from "@/components/FavControl";

import { upsertJsonLd, makeItemListLD, makeBreadcrumbsLD } from "@/lib/jsonld";
import { SITE_URL } from "@/config";

import { casinos } from "@/data/casinos";

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function OffersPage() {
  const items = useMemo(() => {
    return casinos
      .filter((o) => o.enabled !== false)
      .map((o) => {
        const slug = o.slug ?? slugify(o.name);
        return {
          name: o.name,
          url: `/offers/${encodeURIComponent(slug)}`,
        };
      });
  }, []);

  useEffect(() => {
    const cleanA = upsertJsonLd("jsonld-offers", makeItemListLD(SITE_URL, items));
    const cleanB = upsertJsonLd(
      "jsonld-breadcrumbs",
      makeBreadcrumbsLD(SITE_URL, [
        { name: "Home", url: "/" },
        { name: "Offers", url: "/offers" },
      ])
    );
    return () => {
      cleanA();
      cleanB();
    };
  }, [items]);

  return (
    <Section className="space-y-6">
      <h1 className="text-2xl font-bold">Best Casino Offers</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {casinos.map((o) => {
          const id = o.slug ?? slugify(o.name);
          return (
            <Card key={id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">
                    <Link
                      to={`/offers/${encodeURIComponent(id)}`}
                      className="hover:underline"
                    >
                      {o.name}
                    </Link>
                  </div>
                  {o.license ? (
                    <div className="text-xs text-[var(--text-dim)]">{o.license}</div>
                  ) : null}
                </div>
                <FavControl id={id} />
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}