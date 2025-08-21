// src/types/offer.ts
export type PaymentMethod =
  | "Cards" | "SEPA" | "Crypto" | "Paypal" | "Skrill"
  | string;
  
export type Offer = {
  slug?: string;
  name: string;
  rating: number;
  license: "MGA" | "Curaçao" | "UKGC" | "Other" | string;
  payout: string;
  payoutHours?: number;
  methods?: string[];
  payments?: string[];
  link?: string;
  enabled?: boolean;
  position?: number;
};
















