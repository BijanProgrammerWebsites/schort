import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  }),
);

export const links = pgTable("links", {
  id: uuid("id").defaultRandom().primaryKey(),
  original: text("original").notNull(),
  alias: text("alias").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
}));

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type Link = InferSelectModel<typeof links>;
