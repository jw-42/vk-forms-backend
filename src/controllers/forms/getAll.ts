import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import prisma from "../../prisma";
import "../../utils/index";

const factory = createFactory();

export const getAll = factory.createHandlers(async (c: Context, next: Next) => {
  try {
    const forms = await prisma.form.findMany({
      where: {
        owner_id: c.get("uid"),
        is_banned: false,
      },
      select: {
        id: true,
        title: true,
        updated_at: true,
      },
      orderBy: [
        { updated_at: "desc" }
      ],
      take: 30
    });

    return c.json({
      response: forms,
    });
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      console.error(e);
      throw ApiError.internal();
    }
  }
});
