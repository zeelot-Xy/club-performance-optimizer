import type { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../config/http.js";
import { verifyAccessToken } from "../lib/jwt.js";

export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    response.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: "Authentication token is required.",
    });
    return;
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const payload = verifyAccessToken(token);
    request.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    response.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: "Authentication token is invalid or expired.",
    });
  }
};
