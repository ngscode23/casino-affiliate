export function OrgJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Casino Watch",
    url: "https://your-domain.com/",
    logo: "https://your-domain.com/logo.png",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}