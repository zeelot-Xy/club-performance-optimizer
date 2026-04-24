import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../config/http.js";
import { loginSchema } from "./auth.schema.js";
import { authService } from "./auth.service.js";

export const authController = {
  async login(request: Request, response: Response) {
    const payload = loginSchema.parse(request.body);
    const result = await authService.login(payload.email, payload.password);

    response.status(HTTP_STATUS.OK).json(result);
  },

  async me(request: Request, response: Response) {
    const user = await authService.getCurrentUser(request.auth!.userId);
    response.status(HTTP_STATUS.OK).json(user);
  },
};
