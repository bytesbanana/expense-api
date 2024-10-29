import { Hono } from "hono";
import { Bindings } from "@/types";
import transaction from "@/routes/transaction";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));
app.route("/transactions", transaction);

export default app;
