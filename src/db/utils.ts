import { Context } from "hono";
import { Env } from "@/types";
import { drizzle } from "drizzle-orm/d1";

export async function getDB(c: Context<Env>) {
  return drizzle(c.env.DB);
}
