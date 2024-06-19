import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import { VAR } from "../../consts/variables";
import prisma from "../../prisma";
import { z } from "zod";

const factory = createFactory();

export const edit = factory.createHandlers(
  async (c: Context, next: Next) => {
    const body = await c.req.json();
    
    const schema = z.object({
      question_id: z.number(),
      text: z.string()
        .min(VAR.QUESTION_MIN_LENGTH)
        .max(VAR.QUESTION_MAX_LENGTH)
    });
    
    const validateSchema = schema.safeParse(body);
    
    if (!validateSchema.success) {
      throw ApiError.badRequest(
        validateSchema
          .error
          .errors
          .map((e) => `[${e.path.map((p) => p.toString()).join("/")}]: ${e.message}`).join(",")
      );
    }
    
    try {
      const changes = await prisma.question.updateMany({
        where: {
          id: validateSchema.data.question_id,
          form: {
            owner_id: c.get("uid"),
            is_banned: false
          }
        },
        data: {
          text: validateSchema.data.text
        }
      });

      return c.json({
        response: changes.count
      })
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