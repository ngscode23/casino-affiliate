// scripts/gen-sitemap.ts
import { writeFileSync } from "fs";
import { offersNormalized } from "../src/lib/offers";

const origin = process.env.SITE_ORIGIN || "https://example.com";
const urls = [
  "/", "/compare", "/favorites", "/privacy",
  ...offersNormalized
    .filter(o => o.slug && o.enabled !== false)
    .map(o => `/offers/${encodeURIComponent(o.slug)}`),
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${origin}${u}</loc></url>`).join("\n") +
  `\n</urlset>\n`;

writeFileSync("public/sitemap.xml", xml, "utf-8");
console.log(`Sitemap with ${urls.length} URLs written to public/sitemap.xml`);