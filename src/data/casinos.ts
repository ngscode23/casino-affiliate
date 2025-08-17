// src/data/casinos.ts
export type Offer = {
  name: string;
  rating: number;
  license: "MGA" | "Curaçao" | "UKGC" | "Other";
  payout: string;            // строка для отображения
  payoutHours?: number;      // числовой эквивалент для сортировки (в часах)
  methods: ("Cards" | "SEPA" | "Crypto" | "Paypal" | "Skrill")[];
  link: string;
  enabled?: boolean;
  position?: number;
};

export const casinos: Offer[] = [
  {
    name: "SkySpin",
    rating: 4.6,
    license: "MGA",
    payout: "1–2 дня",
    payoutHours: 36,
    methods: ["Cards", "SEPA"],
    link: "/go/skyspin",
    enabled: true,
    position: 1,
  },
  {
    name: "NovaWin",
    rating: 4.4,
    license: "Curaçao",
    payout: "до 48 ч",
    payoutHours: 48,
    methods: ["Cards", "Crypto"],
    link: "/go/novawin",
    enabled: true,
    position: 2,
  },
  {
    name: "RapidPay",
    rating: 4.3,
    license: "MGA",
    payout: "до 24 ч",
    payoutHours: 24,
    methods: ["SEPA", "Paypal"],
    link: "/go/rapidpay",
    enabled: true,
    position: 3,
  },
];