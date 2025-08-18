import { z } from "zod";

export const OfferSchema = z.object({
  slug: z.string(),
  name: z.string(),
  rating: z.number(),
  license: z.enum(["MGA", "Curaçao", "UKGC", "Other"]),
  payout: z.string(),
  payoutHours: z.number().optional(),
  methods: z.array(z.enum(["Cards", "SEPA", "Crypto", "Paypal", "Skrill"])),
  link: z.string().url().optional(),
  enabled: z.boolean().optional(),
  position: z.number().optional()
});

export type Offer = z.infer<typeof OfferSchema>;