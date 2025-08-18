export function SiteJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Casino Watch",
    url: "https://your-domain.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://your-domain.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}