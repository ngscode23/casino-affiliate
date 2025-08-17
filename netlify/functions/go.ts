import type { Handler } from "@netlify/functions";

// вынеси в .env позже
const MAP: Record<string, string> = {
  "casino-x": "https://partner.example.com/?affid=123",
  "casino-y": "https://partner.example.com/?affid=456",
};

export const handler: Handler = async (event) => {
  // event.path будет вида: "/.netlify/functions/go/casino-x"
  const parts = (event.path || "").split("/");
  const slug = parts[parts.length - 1] || "";

  const target = MAP[slug];
  if (!target) {
    return { statusCode: 404, body: "Not found" };
  }

  // минимальный лог (в прод — отправляй в аналитику/БД)
  console.log(JSON.stringify({
    t: Date.now(),
    slug,
    ua: event.headers["user-agent"],
    ref: event.headers.referer || null,
    ip: event.headers["x-forwarded-for"] || null,
  }));

  return {
    statusCode: 302,
    headers: {
      Location: target,
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer-when-downgrade",
    },
  };
};