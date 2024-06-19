import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import { VAR } from "../../consts/variables";
import prisma from "../../prisma";
import "../../utils/index";
import { z } from "zod";

const factory = createFactory();

export const get = factory.createHandlers(
  async (c: Context, next: Next) => {
    const body = await c.req.json();
    
    const schema = z.object({
      form_id: z.number().min(1)
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
      const questions = await prisma.question.findMany({
        where: {
          form_id: validateSchema.data.form_id,
          is_deleted: false,
        },
        select: {
          id: true,
          type: true,
          option: {
            where: {
              is_deleted: false
            }
          },
          answers: {
            where: {
              group: {
                completed: true
              }
            },
            select: {
              option_id: true,
              value: true,
              option: {
                select: {
                  text: true
                }
              }
            }
          }
        }
      });

      const stats = questions.map((q) => {
        let uniqueValues = new Map();
        let uniqueOptions = new Map();
        let obj = {}

        q.answers.forEach((a) => {
          if (a.option_id && a.option?.text) {
            if (isNaN(uniqueOptions.get(a.option.text))) {
              uniqueOptions.set(a.option.text, 1)
            } else {
              uniqueOptions.set(a.option.text, uniqueOptions.get(a.option.text) + 1)
            }
            obj = Object.fromEntries(uniqueOptions)
          } else {
            if (isNaN(uniqueValues.get(a.value))) {
              uniqueValues.set(a.value, 1)
            } else {
              uniqueValues.set(a.value, uniqueValues.get(a.value) + 1)
            }
            obj = Object.fromEntries(uniqueValues)
          }
        })

        return {
          id: q.id,
          type: q.type,
          stats: {...obj}
        };
      });
    
      return c.json({
        response: stats
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