import { ApiError } from "../error/ApiError";
import { verify } from "hono/jwt";
import { Context } from "hono";
import prisma from "../prisma";

const AuthorizationMiddleware = async (c: Context, next: any) => {
  const authorization = c.req.header("Authorization");

  if (!authorization) {
    throw ApiError.unauthorized();
  }

  try {
    const token = authorization.split("Bearer ")[1];
    const secret_key = `${Bun.env.ACCESS_TOKEN_SECRET}`;

    const decoded = await verify(token, secret_key);

    if (decoded.uid && decoded.exp) {
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.uid,
        },
      });

      if (user === null) {
        throw ApiError.forbidden("Access denied: user is not defined");
      }

      c.set("uid", decoded.uid);
      c.set("role", user.role_id);
    } else {
      throw ApiError.forbidden("Access denied: invalid access token");
    }
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      console.error(e);
      throw ApiError.internal();
    }
  }

  return next();
};

export default AuthorizationMiddleware;
