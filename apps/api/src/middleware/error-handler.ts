import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { HTTP_STATUS } from "../config/http.js";
import { HttpError } from "../lib/http-error.js";

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    response.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Validation failed.",
      details: error.issues,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      response.status(HTTP_STATUS.CONFLICT).json({
        message: "A unique field value already exists.",
        details: error.meta,
      });
      return;
    }
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
    return;
  }

  console.error(error);

  response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "An unexpected server error occurred.",
  });
};
