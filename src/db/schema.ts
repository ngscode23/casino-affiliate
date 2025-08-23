import {
  pgEnum,
  pgTable,
  text,
  integer,
  boolean,
  numeric,
  uuid,
  timestamp,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Unicode в enum допустим, Postgres переварит 'Curaçao'
export const licenseEnum = pgEnum("license", ["MGA", "Curaçao", "UKGC", "Other"]);
export const methodEnum = pgEnum("method", ["Cards", "SEPA", "Crypto", "Paypal", "Skrill"]);

export const offers = pgTable(
  "offers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    slug: text("slug").notNull(),

    name: text("name").notNull(),

    // 2 знака всего, 1 после запятой -> 0.0..9.9. Для шкалы до 5.0 нормально.
    rating: numeric("rating", { precision: 2, scale: 1 }),

    // null -> неизвестно
    payoutHours: integer("payout_hours"),

    license: licenseEnum("license").notNull(),

    link: text("link"),

    enabled: boolean("enabled").default(true).notNull(),

    position: integer("position").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

    // В Postgres нет авто-обновления на уровне столбца. Либо триггер в БД, либо обновляй в коде.
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    // Явный уникальный индекс вместо .unique() на колонке — прозрачнее и предсказуемее
    slugUnique: uniqueIndex("offers_slug_unique").on(t.slug),
  })
);

export const offerMethods = pgTable(
  "offer_methods",
  {
    offerId: uuid("offer_id")
      .notNull()
      .references(() => offers.id, { onDelete: "cascade" }),

    method: methodEnum("method").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.offerId, t.method] }),
  })
);

// Связи
export const offersRelations = relations(offers, ({ many }) => ({
  methods: many(offerMethods),
}));

export const offerMethodsRelations = relations(offerMethods, ({ one }) => ({
  offer: one(offers, {
    fields: [offerMethods.offerId],
    references: [offers.id],
  }),
}));


















