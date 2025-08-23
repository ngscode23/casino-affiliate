import type { Offer } from "@/types/offer";

export function itemListFromOffers(baseUrl: string, offers: Offer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": offers.map((o, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": ${baseUrl}/offers/
    }))
  };
}
