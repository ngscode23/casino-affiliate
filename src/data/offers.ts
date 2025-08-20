import type { Offer } from "../types/offer";

export const offers: Offer[] = [
  {
    slug: "skyspin",
    name: "SkySpin",
    rating: 4.6,
    payout: "1–2 дня",
    payoutHours: 36,
    license: "MGA",
    link: "https://partner.example/skyspin",
    enabled: true,
    position: 1,
    methods: ["Cards", "SEPA"],
  },
  {
    slug: "novawin",
    name: "NovaWin",
    rating: 4.4,
    payout: "до 48 ч",
    payoutHours: 48,
    license: "Curaçao",
    link: "https://partner.example/novawin",
    enabled: true,
    position: 2,
    methods: ["Cards", "Crypto"],
  }
];