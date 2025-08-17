import type { Handler } from "@netlify/functions";

const map: Record<string, string> = {
  skyspin: "https://partner.example/skyspin",
  novawin: "https://partner.example/novawin",
};

export const handler: Handler = async (event) => {
  const path = event.path || "";
  const slug = path.split("/go/")[1]?.replace(/^\//, "") || "";
  const url = map[slug];

  if (!url) {
    return { statusCode: 404, body: "Unknown offer" };
  }

  return {
    statusCode: 302,
    headers: { Location: url, "Cache-Control": "no-store" },
  };
};