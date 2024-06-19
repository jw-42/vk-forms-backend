import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import { VAR } from "../../consts/variables";
import prisma from "../../prisma";
import "../../utils/index";
import { z } from "zod";

const factory = createFactory();

export const getById = factory.createHandlers(
  async (c: Context, next: Next) => {
    const body = await c.req.json();

    const schema = z.object({
      question_id: z.number().min(1),
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
      const question = await prisma.question.findFirst({
        where: {
          id: validateSchema.data.question_id,
          is_deleted: false,
          form: {
            is_banned: false
          }
        },
        select: {
          id: true,
          type: true,
          text: true,
          option: {
            select: {
              id: true,
              text: true
            }
          }
        }
      });

      if (question === null) {
        throw ApiError.badRequest();
      }

      return c.json({
        response: question
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
