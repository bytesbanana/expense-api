import { UserInsert, users } from "@/db/schema";
import { getDB } from "@/db/utils";
import { Bindings, Env } from "@/types";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import { compareSync, genSaltSync, hashSync } from "bcrypt-edge";
import { generateJWT } from "@/jwt";
import { setTokenCookie } from "@/cookie";

const app = new Hono<Env>();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const authSchemaMiddleware = zValidator("json", authSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        message: fromError(result.error).toString(),
      },
      400
    );
  }
});

app.post("/signup", authSchemaMiddleware, async (c) => {
  const { email, password } = c.req.valid("json");
  const db = await getDB(c);

  const usersResult = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (usersResult.length) {
    return c.json(
      {
        message: "Email already exists",
      },
      400
    );
  }

  let newUser: Pick<UserInsert, "id" | "email">;
  try {
    const newUsers = await db
      .insert(users)
      .values({
        email,
        hashed_password: hashSync(password, genSaltSync(10)),
      })
      .returning({
        id: users.id,
        email: users.email,
      });

    if (!newUsers.length) throw new Error();

    newUser = newUsers[0];
  } catch (error) {
    return c.json(
      {
        message: "Something went wrong",
      },
      500
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const expireDate = now + 2 * (60 * 60); // Now + 2h,
  const token = await generateJWT(newUser.id!, email, expireDate);
  setTokenCookie(c, token, expireDate);

  return c.json(
    {
      email,
      token,
    },
    200
  );
});

app.post("/signin", authSchemaMiddleware, async (c) => {
  const { email, password } = c.req.valid("json");
  const db = await getDB(c);

  const usersResult = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!usersResult.length) {
    return c.json(
      {
        message: "Unauthorized",
      },
      401
    );
  }

  const user = usersResult[0];
  if (!compareSync(password, user.hashed_password)) {
    return c.json(
      {
        message: "Unauthorized",
      },
      401
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const expireDate = now + 2 * (60 * 60); // Now + 2h,
  const token = await generateJWT(user.id, email, expireDate);
  setTokenCookie(c, token, expireDate);

  return c.json(
    {
      email,
      token,
    },
    200
  );
});
export default app;
