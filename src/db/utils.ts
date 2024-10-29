import { Context } from "hono";
import { Bindings } from "../types";
import { drizzle } from "drizzle-orm/d1";

export async function getDB(
  c: Context<{
    Bindings: Bindings;
  }>
) {
  return drizzle(c.env.DB);
}
