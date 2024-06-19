import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import { VAR } from "../../consts/variables";
import prisma from "../../prisma";
import { z } from "zod";

const factory = createFactory();

export const create = factory.createHandlers(async (c: Context, next: Next) => {
  const body = await c.req.json();

  const schema = z.object({
    question_id: z.number().min(1),
    text: z.string().min(VAR.OPTION_MIN_LENGTH).max(VAR.OPTION_MAX_LENGTH),
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
    const question = await prisma.question.findFirst({
      where: {
        id: validateSchema.data.question_id,
        type: { in: ["radio", "checkbox"] },
        form: {
          owner_id: c.get("uid"),
          is_banned: false,
        },
      },
    });

    if (question === null) {
      throw ApiError.badRequest("can't find question with type [radio] or [checkbox]");
    }

    const option = await prisma.option.create({
      data: {
        question_id: validateSchema.data.question_id,
        text: validateSchema.data.text,
      },
    });

    return c.json({
      response: option.id,
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
