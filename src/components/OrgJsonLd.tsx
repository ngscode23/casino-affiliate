import { useEffect } from "react";
import { upsertJsonLd } from "../lib/jsonld";
import { SITE_NAME, SITE_URL, SITE_LOGO } from "../config/site";

type Props = { name?: string; url?: string; logo?: string };

export default function OrgJsonLd({ name = SITE_NAME, url = SITE_URL, logo = SITE_LOGO }: Props) {
  useEffect(() => upsertJsonLd("org", {
    "@context": "https://schema.org",
    "@type": "Organization",
    name, url, logo
  }), [name, url, logo]);
  return null;
}
