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
      option_id: z.number().min(1),
      text: z.string()
        .min(VAR.OPTION_MIN_LENGTH)
        .max(VAR.OPTION_MAX_LENGTH)
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
      const changes = await prisma.option.updateMany({
        data: {
          text: validateSchema.data.text
        },
        where: {
          id: validateSchema.data.option_id,
          question: {
            form: {
              owner_id: c.get("uid"),
              is_banned: false
            }
          }
        }
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
  }
);