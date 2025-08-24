// src/config/site.ts
export const SITE_NAME = "Casino Watch";
export const SITE_URL  = "https://lucky-macaron-c3c96c.netlify.app"; // без финального /
export const SITE_LOGO = "/logo.png"; // либо абсолютный URL

// если где-то ждут объект — удобный дефолтный экспорт
const site = { SITE_NAME, SITE_URL, SITE_LOGO };
export default site;