import { useEffect } from "react";
import { upsertJsonLd } from "../lib/jsonld";
import { SITE_NAME, SITE_URL } from "../config/site";

type Props = { name?: string; url?: string };

export default function SiteJsonLd({ name = SITE_NAME, url = SITE_URL }: Props) {
  useEffect(() => upsertJsonLd("website", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name, url
  }), [name, url]);
  return null;
}
