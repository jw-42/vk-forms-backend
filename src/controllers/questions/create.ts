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
    form_id: z.number().min(1),
    type: z.enum(["short_text", "radio", "checkbox", "email", "phone"]),
    text: z
      .string()
      .min(VAR.QUESTION_MIN_LENGTH)
      .max(VAR.QUESTION_MAX_LENGTH),
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
    const form = await prisma.form.findFirst({
      where: {
        id: validateSchema.data.form_id,
        owner_id: c.get("uid")
      }
    });
    
    if (form === null) {
      throw ApiError.badRequest("form_id is invalid");
    } else if (!form.enable) {
      throw ApiError.badRequest("form is disabled")
    } else if (form.is_banned) {
      throw ApiError.forbidden("Access denied: form has been banned")
    }

    const question = await prisma.question.create({
      data: {
        form_id: validateSchema.data.form_id,
        type: validateSchema.data.type,
        text: validateSchema.data.text
      }
    });

    return c.json({
      response: question.id
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
