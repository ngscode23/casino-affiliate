// scripts/generate-sitemap.ts
import fs from "fs";
import path from "path";

const origin = process.env.SITE_ORIGIN || "https://example.com";

// Страницы, которые точно есть
const routes = [
  "/",
  "/offers",
  "/compare",
  "/favorites",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/legal/cookies",
  "/legal/responsible",
  "/legal/affiliate-disclosure",
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `
  <url>
    <loc>${origin}${r}</loc>
    <changefreq>weekly</changefreq>
    <priority>${r === "/" ? "1.0" : "0.7"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

const outDir = path.resolve("dist");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");

console.log("✅ sitemap.xml generated in dist/");
