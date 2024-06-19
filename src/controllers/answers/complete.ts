import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import prisma from "../../prisma";
import { z } from "zod";

const factory = createFactory();

export const complete = factory.createHandlers(
  async (c: Context, next: Next) => {
    const body = await c.req.json();

    const schema = z.object({
      form_id: z.number().min(1),
    });

    const validateSchema = schema.safeParse(body);

    if (!validateSchema.success) {
      throw ApiError.badRequest(
        validateSchema.error.errors
          .map(
            (e) =>
              `[${e.path.map((p) => p.toString()).join("/")}]: ${e.message}`
          )
          .join(",")
      );
    }

    try {
      const completed = await prisma.answersGroup.updateMany({
        where: {
          form_id: validateSchema.data.form_id,
          completed: false
        },
        data: {
          completed: true
        },
      });

      return c.json({
        response: completed.count
      });
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
