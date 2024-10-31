import { Hono } from "hono";
import { Bindings, CustomJWTPayload } from "@/types";
import transaction from "@/routes/transaction";
import auth from "@/routes/auth";
import { bearerAuth } from "hono/bearer-auth";
import { getCookie } from "hono/cookie";
import { verifyJWT } from "./jwt";

const app = new Hono<{ Bindings: Bindings }>();

app.route("/auth", auth);

app.use(
  "/*",
  bearerAuth({
    verifyToken: async (token, c) => {
      try {
        const cookieToken = getCookie(c, "token") || "";
        const payload = (await verifyJWT(
          token || cookieToken
        )) as CustomJWTPayload;

        c.set("userId", payload.userId);
        c.set("email", payload.email);
      } catch (error) {
        return false;
      }

      return true;
    },
  })
);

app.route("/transactions", transaction);

export default app;
