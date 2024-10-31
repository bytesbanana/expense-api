import { Jwt } from "hono/utils/jwt";

export async function generateJWT(
  userId: number,
  email: string,
  expireDate: number
) {
  const token = await Jwt.sign(
    {
      userId,
      email,
      exp: expireDate,
    },
    "secret"
  );

  return token;
}

export async function verifyJWT(token: string) {
  return await Jwt.verify(token, "secret");
}
