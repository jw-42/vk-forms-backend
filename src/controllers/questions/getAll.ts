import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import prisma from "../../prisma";
import "../../utils/index";
import { z } from "zod";

const factory = createFactory();

export const getAll = factory.createHandlers(async (c: Context, next: Next) => {
  const body = await c.req.json();

  const schema = z.object({
    form_id: z.number().min(1),
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
    const questions = await prisma.question.findMany({
      where: {
        is_deleted: false,
        form: {
          id: validateSchema.data.form_id,
          is_banned: false,
        },
      },
      select: {
        id: true,
        type: true,
        text: true,
        option: {
          select: {
            id: true,
            text: true,
          },
        },
      },
      orderBy: [
        { id: "asc" }
      ],
      take: 30
    });

    return c.json({
      response: questions,
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
