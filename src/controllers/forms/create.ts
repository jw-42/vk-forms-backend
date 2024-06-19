import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import { VAR } from "../../consts/variables";
import prisma from "../../prisma";
import "../../utils/index";
import { z } from "zod";

const factory = createFactory();

export const create = factory.createHandlers(async (c: Context, next: Next) => {
  const body = await c.req.json();

  const schema = z.object({
    type: z.enum(["default"]).optional(),
    title: z.string()
      .min(VAR.TITLE_MIN_LENGTH)
      .max(VAR.TITLE_MAX_LENGTH),
    description: z
      .string()
      .min(VAR.DESCRIPTION_MIN_LENGTH)
      .max(VAR.DESCRIPTION_MAX_LENGTH),
  });

  const validateSchema = schema.safeParse(body);

  if (!validateSchema.success) {
    throw ApiError.badRequest(
      validateSchema.error.errors
        .map(
          (e) => `[${e.path.map((p) => p.toString()).join("/")}]: ${e.message}`
        )
        .join(",")
    );
  }

  try {
    const form = await prisma.form.create({
      data: {
        ...validateSchema.data,
        user: {
          connect: {
            id: c.get("uid"),
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (form === null) {
      throw ApiError.badRequest();
    }

    return c.json({
      response: form.id,
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
