import { Hono } from "hono";
import { Env } from "@/types";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { fromError } from "zod-validation-error";
import { getDB } from "@/db/utils";

import { transactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const transactionSchema = z.object({
  date: z.string().datetime(),
  amount: z.number(),
  type: z.enum(["Income", "Expense", "Other"]),
  category: z.string(),
  description: z.string().optional().default(""),
});

const app = new Hono<Env>();

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
    const userId = c.var.userId;
    const tx = c.req.valid("json");

    const db = await getDB(c);

    const result = await db
      .insert(transactions)
      .values({
        ...tx,
        userId: userId,
      })
      .returning();

    if (!result.length) {
      return c.json(
        {
          message: "Error creating transaction",
        },
        500
      );
    }

    return c.json(
      {
        ...result[0],
      },
      201
    );
  }
);

app.get("/:id", async (c) => {
  const db = await getDB(c);
  const id = c.req.param("id");

  if (!id) {
    return c.json(
      {
        message: "Invalid request",
      },
      400
    );
  }

  const userId = c.get("userId");
  const result = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, +id), eq(transactions.userId, userId)))
    .limit(1);

  if (!result.length) {
    return c.json(
      {
        message: "Transaction not found",
      },
      404
    );
  }

  return c.json(
    {
      ...result[0],
    },
    200
  );
});

app.put(
  "/:id",
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
    const db = await getDB(c);
    const id = c.req.param("id");
    const tx = c.req.valid("json");

    const userId = c.get("userId");
    const existingTx = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, +id), eq(transactions.userId, userId)));

    if (!existingTx.length) {
      return c.json(
        {
          message: "Transaction not found",
        },
        404
      );
    }

    const result = await db
      .update(transactions)
      .set(tx)
      .where(eq(transactions.id, +id))
      .returning();

    if (!result.length) {
      return c.json(
        {
          message: "Error updating transaction",
        },
        500
      );
    }

    return c.json(
      {
        ...result[0],
      },
      200
    );
  }
);

app.delete("/:id", async (c) => {
  const db = await getDB(c);
  const id = c.req.param("id");

  if (!id) {
    return c.json(
      {
        message: "Invalid request",
      },
      400
    );
  }

  const userId = c.get("userId");
  const existingTx = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, +id), eq(transactions.userId, userId)))
    .limit(1);

  if (!existingTx.length) {
    return c.json(
      {
        message: "Transaction not found",
      },
      404
    );
  }

  const result = await db.delete(transactions).where(eq(transactions.id, +id));

  if (!result.success) {
    return c.json(
      {
        message: "Error deleting transaction",
      },
      500
    );
  }

  return c.json(
    {
      message: "Transaction deleted",
    },
    200
  );
});

export default app;
