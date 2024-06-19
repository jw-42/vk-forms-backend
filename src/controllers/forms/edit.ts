import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import { VAR } from "../../consts/variables";
import prisma from "../../prisma";
import "../../utils/index";
import { z } from "zod";

const factory = createFactory();

export const edit = factory.createHandlers(async (c: Context, next: Next) => {
  const body = await c.req.json();

  const schema = z
    .object({
      form_id: z.number().min(1),
      title: z
        .string()
        .min(VAR.TITLE_MIN_LENGTH)
        .max(VAR.TITLE_MAX_LENGTH)
        .optional(),
      description: z
        .string()
        .min(VAR.DESCRIPTION_MIN_LENGTH)
        .max(VAR.DESCRIPTION_MAX_LENGTH)
        .optional(),
    })
    .refine((data) => data.title || data.description, {
      message: "title or description is required",
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
    const { form_id, ...data } = validateSchema.data;

    const changes = await prisma.form.updateMany({
      where: {
        id: form_id,
        is_banned: false,
        owner_id: c.get("uid"),
      },
      data: data
    });

    return c.json({
      response: changes.count
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
