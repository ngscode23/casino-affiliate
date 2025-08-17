import type { Handler } from "@netlify/functions";

// Один источник правды: slug -> целевой URL
const map: Record<string, string> = {
  skyspin: "https://partner.example/skyspin?utm_source=cw&utm_medium=aff",
  novawin: "https://partner.example/novawin?utm_source=cw&utm_medium=aff",
  rapidpay: "https://partner.example/rapidpay?utm_source=cw&utm_medium=aff",
};

export const handler: Handler = async (event) => {
  const slug = event.path.split("/go/")[1]?.replace(/^\//, "") || "";
  const url = map[slug];
  if (!url) return { statusCode: 404, body: "Unknown offer" };

  // Анти-кэш, чтобы не липли редиректы
  return { statusCode: 302, headers: { Location: url, "Cache-Control": "no-store" } };
};