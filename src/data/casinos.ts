// src/data/casinos.ts

export type Offer = {
  slug: string;
  name: string;
  rating: number;
  license: "MGA" | "Curaçao" | "UKGC" | "Other";
  payout: string;
  payoutHours?: number;
  methods: ("Cards" | "SEPA" | "Crypto" | "Paypal" | "Skrill")[];
  link?: string;        // можно не указывать, если используем /go/:slug
  enabled?: boolean;
  position?: number;
};

export const casinos: Offer[] = [
  {
    slug: "skyspin",
    name: "SkySpin",
    rating: 4.6,
    license: "MGA",
    payout: "1–2 дня",
    payoutHours: 36,
    methods: ["Cards", "SEPA"],
    enabled: true,
    position: 1,
  },
  {
    slug: "novawin",
    name: "NovaWin",
    rating: 4.4,
    license: "Curaçao",
    payout: "до 48 ч",
    payoutHours: 48,
    methods: ["Cards", "Crypto"],
    enabled: true,
    position: 2,
  },
  {
    slug: "rapidpay",
    name: "RapidPay",
    rating: 4.3,
    license: "MGA",
    payout: "до 24 ч",
    payoutHours: 24,
    methods: ["SEPA", "Paypal"],
    enabled: true,
    position: 3,
  },
  {
    slug: "casino-a",              // ← обязательно
    name: "Casino A",
    rating: 4.5,
    license: "MGA",
    payout: "1–2 дня",
    methods: ["Cards", "Paypal"],  // ← заменил Visa/MasterCard на допустимые
    // link: "https://casino-a.com", // либо slug+go, либо прямая ссылка — на твой выбор
    enabled: true,
    position: 4,                   // ← уникальная позиция
  },
];