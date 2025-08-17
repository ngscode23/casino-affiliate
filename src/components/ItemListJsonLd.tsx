export function ItemListJsonLd({ items }: { items: { name: string; url: string; rating?: number; reviews?: number }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": items.map((it, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Organization",
        "name": it.name,
        "url": it.url,
        ...(it.rating && it.reviews ? {
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": it.rating.toFixed(1), "reviewCount": it.reviews }
        } : {})
      }
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}