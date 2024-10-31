import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { Env } from "@/types";

export async function setTokenCookie(
  c: Context<Env>,
  token: string,
  expireDate: number
) {
  setCookie(c, "token", token, {
    path: "/",
    secure: true,
    httpOnly: true,
    maxAge: 1000,
    expires: new Date(expireDate * 1000),
  });
}
