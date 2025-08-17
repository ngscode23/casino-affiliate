export type Offer = {
  name: string;
  rating: number;
  license: string;
  payout: string;
  methods: string;
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
    methods: "Visa, MasterCard, SEPA",
    link: "/go/skyspin",
    enabled: true,
    position: 1,
  },
  {
    name: "NovaWin",
    rating: 4.4,
    license: "Curaçao",
    payout: "до 48 ч",
    methods: "Cards, Crypto",
    link: "/go/novawin",
    enabled: true,
    position: 2,
  },
];