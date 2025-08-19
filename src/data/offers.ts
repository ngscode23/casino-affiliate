// src/data/offers.ts
import type { Offer } from "@/types/offer";

export const offers: Offer[] = [
  {
    id: "1",
    slug: "skyspin",
    name: "SkySpin",
    rating: 4.6,
    payoutHours: 36,
    license: "MGA",
    link: "https://partner.example/skyspin?utm_source=casinowatch&utm_medium=aff",
    enabled: true,
    position: 1,
    methods: ["Cards", "SEPA"],
  },
  {
    id: "2",
    slug: "novawin",
    name: "NovaWin",
    rating: 4.4,
    payoutHours: 48,
    license: "Curaçao",
    link: "https://partner.example/novawin?utm_source=casinowatch&utm_medium=aff",
    enabled: true,
    position: 2,
    methods: ["Cards", "Crypto"],
  },
  {
    id: "3",
    slug: "rapidpay",
    name: "RapidPay",
    rating: 4.3,
    payoutHours: 24,
    license: "MGA",
    link: "https://partner.example/rapidpay?utm_source=casinowatch&utm_medium=aff",
    enabled: true,
    position: 3,
    methods: ["Cards", "Crypto", "Paypal"],
  },
];