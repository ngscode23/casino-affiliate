// scripts/gen-sitemap.ts
import { writeFileSync } from "fs";
import { offersNormalized } from "../src/lib/offers";



const origin = process.env.SITE_ORIGIN ?? "https://https://lucky-macaron-c3c96c.netlify.app/";
const routes = ["/", "/compare", "/offers"];
// TODO: подхватить слуги из БД/API в билде
const offers = []; // заполни массивом слугов
const urls = [...routes, ...offers.map(s => `/offers/${encodeURIComponent(s)}`)]
  .map(p => `<url><loc>${origin}${p}</loc><changefreq>daily</changefreq></url>`)
  .join("");

const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
writeFileSync("public/sitemap.xml", xml);
console.log("sitemap.xml updated");

writeFileSync("public/sitemap.xml", xml, "utf-8");
console.log(`Sitemap with ${urls.length} URLs written to public/sitemap.xml`);




