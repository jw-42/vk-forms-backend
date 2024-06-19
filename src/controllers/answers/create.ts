import { Context, Next } from "hono";
import { createFactory } from "hono/factory";
import { ApiError } from "../../error/ApiError";
import { VAR } from "../../consts/variables";
import prisma from "../../prisma";
import { z } from "zod";

const factory = createFactory();

export const create = factory.createHandlers(async (c: Context, next: Next) => {
  const body = await c.req.json();

  const schema = z
    .object({
      question_id: z.number().min(1),
      option_id: z.number().min(1).optional(),
      text: z
        .string()
        .min(VAR.ANSWERS_VALUE_MIN_LENGTH)
        .max(VAR.ANSWERS_VALUE_MAX_LENGTH)
        .optional(),
    })
    .refine((data) => data.option_id || data.text, {
      message: "option_id or text is required",
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
  } else if (validateSchema.data.option_id && validateSchema.data.text) {
    throw ApiError.badRequest("need either option_id or text");
  }

  try {
    const answer = await prisma.$transaction(async (prisma) => {
      const question = await prisma.question.findUnique({
        where: { id: validateSchema.data.question_id },
        select: {
          id: true,
          type: true,
          form: {
            select: {
              id: true,
              owner_id: true,
              is_banned: true,
            },
          },
        },
      });

      if (!question) {
        throw ApiError.badRequest();
      } else if (question.form.is_banned) {
        throw ApiError.forbidden("Access denied: form has been banned");
      } else if (
        (question.type === "radio" || question.type === "checkbox") &&
        (!validateSchema.data.option_id || validateSchema.data.text)
      ) {
        throw ApiError.badRequest();
      } else if (
        question.type !== "radio" &&
        question.type !== "checkbox" &&
        (validateSchema.data.option_id || !validateSchema.data.text)
      ) {
        throw ApiError.badRequest();
      }

      let answersGroup = await prisma.answersGroup.findFirst({
        where: {
          completed: false,
          form_id: question.form.id,
        },
      });

      let answer;

      if (answersGroup) {
        const prevAnswers = await prisma.answers.findFirst({
          where: {
            question_id: validateSchema.data.question_id,
            answers_group_id: answersGroup.id,
          },
        });

        if (prevAnswers === null) {
          answer = await prisma.answers.create({
            data: {
              answers_group_id: answersGroup.id,
              question_id: validateSchema.data.question_id,
              option_id: validateSchema.data.option_id,
              value: validateSchema.data.text,
            },
          });
        } else {
          answer = await prisma.answers.update({
            where: { id: prevAnswers.id },
            data: {
              option_id: validateSchema.data.option_id,
              value: validateSchema.data.text,
            },
          });
        }
      } else {
        answersGroup = await prisma.answersGroup.create({
          data: {
            form_id: question.form.id,
            owner_id: c.get("uid"),
            completed: false,
          },
        });

        answer = await prisma.answers.create({
          data: {
            answers_group_id: answersGroup.id,
            question_id: validateSchema.data.question_id,
            option_id: validateSchema.data.option_id,
            value: validateSchema.data.text,
          },
        });
      }

      return {
        id: answer.id,
        answers_group_id: answersGroup.id,
      };
    });

    return c.json({
      response: answer,
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
