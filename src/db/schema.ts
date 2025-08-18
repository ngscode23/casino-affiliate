import { pgEnum, pgTable, text, integer, boolean, numeric, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

export const licenseEnum = pgEnum('license', ['MGA','Curaçao','UKGC','Other']);
export const methodEnum  = pgEnum('method',  ['Cards','SEPA','Crypto','Paypal','Skrill']);

export const offers = pgTable('offers', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  rating: numeric('rating', { precision: 2, scale: 1 }), // 0.0..5.0
  payoutHours: integer('payout_hours'),                  // null -> неизвестно
  license: licenseEnum('license').notNull(),
  link: text('link'),
  enabled: boolean('enabled').default(true).notNull(),
  position: integer('position').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const offerMethods = pgTable('offer_methods', {
  offerId: uuid('offer_id').notNull().references(() => offers.id, { onDelete: 'cascade' }),
  method: methodEnum('method').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.offerId, t.method] }),
}));

export const offersRelations = relations(offers, ({ many }) => ({
  methods: many(offerMethods),
}));