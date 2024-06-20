import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import prisma from "../../prisma";
import "../../utils/index";
import { z } from "zod";

const factory = createFactory();

export const getById = factory.createHandlers(
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
      const form = await prisma.form.findFirst({
        where: {
          id: validateSchema.data.form_id,
        },
        select: {
          id: true,
          owner_id: true,
          enable: true,
          is_banned: true,
          title: true,
          description: true,
          created_at: true,
        },
      });

      if (
        form === null ||
        (form.is_banned && c.get("role") < 4) ||
        (!form.enable && form.owner_id !== c.get("uid") && c.get("role") < 4)
      ) {
        throw ApiError.badRequest();
      }

      return c.json({
        response: {
          ...form,
          can_edit: form.owner_id === BigInt(c.get("uid")),
          owner_id: undefined,
        },
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
