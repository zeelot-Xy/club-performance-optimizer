import type { Request, Response } from "express";

import { HTTP_STATUS } from "../config/http.js";

export const notFoundHandler = (_request: Request, response: Response) => {
  response.status(HTTP_STATUS.NOT_FOUND).json({
    message: "The requested route was not found.",
  });
};
