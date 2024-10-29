import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const transactions = sqliteTable("transactions", {
  id: int().primaryKey({ autoIncrement: true }),
  date: text(),
  amount: int(),
  type: text(),
  category: text(),
  description: text(),
});
