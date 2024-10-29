import { Hono } from "hono";
import { Bindings } from "@/types";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { fromError } from "zod-validation-error";
import { getDB } from "@/db/utils";

import { transactions } from "@/db/schema";

const transactionSchema = z.object({
  date: z.date(),
  amount: z.number(),
  type: z.enum(["Income", "Expense", "Other"]),
  category: z.string(),
  description: z.string().optional().default(""),
});

const app = new Hono<{ Bindings: Bindings }>();

app.post(
  "/",
  zValidator("json", transactionSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          message: fromError(result.error).toString(),
        },
        400
      );
    }
  }),
  async (c) => {
    const tx = c.req.valid("json");

    const db = await getDB(c);

    const result = await db.insert(transactions).values({
      ...tx,
      date: tx.date.toISOString(),
    });

    if (!result.success) {
      return c.json(
        {
          message: "Error creating transaction",
        },
        500
      );
    }

    return c.json(
      {
        message: "Transaction created",
      },
      201
    );
  }
);

export default app;
