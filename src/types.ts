import { JWTPayload } from "hono/utils/jwt/types";

export interface Env {
  Bindings: Bindings;
  Variables: Variables;
}

export type Bindings = {
  DB: D1Database;
};

export type Variables = {
  userId: number;
  email: string;
};

export type CustomJWTPayload = JWTPayload & { userId: number; email: string };
