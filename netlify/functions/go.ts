// netlify/functions/go.ts
import type { Handler } from "@netlify/functions";

const map: Record<string, string> = {
  skyspin:  "https://partner.example/skyspin?utm_source=casinowatch&utm_medium=aff",
  novawin:  "https://partner.example/novawin?utm_source=casinowatch&utm_medium=aff",
  rapidpay: "https://partner.example/rapidpay?utm_source=casinowatch&utm_medium=aff",
};

export const handler: Handler = async (event) => {
  const slug = (event.path ?? "").split("/go/")[1]?.replace(/^\//, "") ?? "";
  const base = map[slug];

  if (!base) {
    return { statusCode: 404, body: "Unknown offer" };
  }

  const q = event.queryStringParameters ?? {};
  const params = new URLSearchParams();

  if (q.ref) params.set("ref", q.ref);
  if (q.cid) params.set("cid", q.cid);

  // Бережно добавляем параметры — если в base уже есть ?, используем &, иначе ?
  const separator = base.includes("?") ? "&" : "?";
  const target = params.toString() ? `${base}${separator}${params.toString()}` : base;

  return {
    statusCode: 302,
    headers: {
      Location: target,
      "Cache-Control": "no-store",
    },
  };
};