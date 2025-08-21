import { useEffect } from "react";
import { upsertJsonLd } from "../lib/jsonld";

type Item = { name: string; url: string; position: number };

export default function ItemListJsonLd({ items }: { items: Item[] }) {
  useEffect(() => upsertJsonLd("itemlist", {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map(i => ({
      "@type": "ListItem",
      position: i.position,
      name: i.name,
      url: i.url,
    })),
  }), [JSON.stringify(items)]);
  return null;
}
