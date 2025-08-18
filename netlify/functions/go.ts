// netlify/functions/go.ts
import type { Handler } from "@netlify/functions";

const map: Record<string, string> = {
  skyspin: "https://partner.example/skyspin?utm_source=casinowatch&utm_medium=aff",
  novawin: "https://partner.example/novawin?utm_source=casinowatch&utm_medium=aff",
  rapidpay: "https://partner.example/rapidpay?utm_source=casinowatch&utm_medium=aff",
};

export const handler: Handler = async (event) => {
  const slug = event.path.split("/go/")[1]?.replace(/^\//, "") || "";
  const base = map[slug];
  if (!base) return { statusCode: 404, body: "Unknown offer" };

  // Протаскиваем реф/кампанию, если передали в ссылке /go/slug?ref=...&cid=...
  const qs = new URLSearchParams();
  const q = event.queryStringParameters || {};
  if (q.ref) qs.set("ref", q.ref);
  if (q.cid) qs.set("cid", q.cid);

  const target = qs.toString() ? `${base}&${qs.toString()}` : base;

  return {
    statusCode: 302,
    headers: {
      Location: target,
      "Cache-Control": "no-store",
    },
  };
};