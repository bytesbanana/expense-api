import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }).notNull(),
  email: text().unique().notNull(),
  hashed_password: text().notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at"),
});

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
}));

export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export const transactions = sqliteTable("transactions", {
  id: int().primaryKey({ autoIncrement: true }),
  date: text(),
  amount: int(),
  type: text(),
  category: text(),
  description: text(),
  userId: int("users_id").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at"),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  users: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export type TransactionSelect = typeof transactions.$inferSelect;
export type TransactionInsert = typeof transactions.$inferInsert;