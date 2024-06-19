import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../error/ApiError";
import { createHmac } from "crypto";
import { sign } from "hono/jwt";
import prisma from "../prisma";

const factory = createFactory();

const checkVKLaunchParams = factory.createHandlers(
  async (c: Context, next: Next) => {
    const { params } = await c.req.json();
    let user;

    if (!params || typeof params !== "object") {
      throw ApiError.badRequest("params is invalid or not provided");
    }

    if (params.vk_user_id != Bun.env.APP_ADMIN_ID) {
      if (params.vk_ts < Date.now() - 3600) {
        {
          throw ApiError.forbidden("Access denied: launch params have expired");
        }
      }
    }

    try {
      if (!(await validateVKLaunchParams(params))) {
        throw ApiError.forbidden("Access denied: invalid launch params");
      }

      user = await prisma.user.findFirst({
        where: {
          vk_user_id: params.vk_user_id
        }
      });

      if (user === null) {
        user = await prisma.user.create({
          data: {
            role_id: 2,
            vk_user_id: params.vk_user_id
          }
        });
      }

      const access_token_payload = {
        uid: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24h
      };

      const secret_key = `${Bun.env.ACCESS_TOKEN_SECRET}`;

      const access_token = await sign(
        access_token_payload,
        secret_key
      );

      await prisma.traffic.create({
        data: params
      });

      return c.json({ access_token });
    } catch (e) {
      if (e instanceof ApiError) {
        throw e;
      } else {
        console.error(e);
        throw ApiError.internal();
      }
    }
  }
);

const validateVKLaunchParams = async (launchParams: any) => {
  let sign: string = "";
  const queryParams: any[] = []

  const processQueryParam = (key: string, value: any) => {
    if (key === 'sign') {
      sign = value
    } else if (key.startsWith('vk_')) {
      queryParams.push({key, value})
    }
  }

  if (typeof launchParams === 'string') {
    const formattedSearch = launchParams.startsWith('?')
      ? launchParams.slice(1)
      : launchParams;
    for (const param of formattedSearch.split('&')) {
      const [key, value] = param.split('=');
      processQueryParam(key, value);
    }
  } else {
    for (const key of Object.keys(launchParams)) {
      const value = launchParams[key];
      processQueryParam(key, value);
    }
  }

  if (!sign || queryParams.length === 0) {
    return false;
  }

  const queryString = queryParams
    .sort((a, b) => a.key.localeCompare(b.key))
    .reduce((acc, {key, value}, idx) => {
      return acc + (idx === 0 ? '' : '&') + `${key}=${encodeURIComponent(value)}`;
    }, '')

  const paramsHash = createHmac('sha256', Bun.env.APP_SECRET ?? "")
    .update(queryString)
    .digest()
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=$/, '');

  return paramsHash === sign;
}

export {
  checkVKLaunchParams
}