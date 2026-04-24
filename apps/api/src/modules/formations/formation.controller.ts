import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../config/http.js";
import { getRouteParam } from "../../lib/get-route-param.js";
import { formationService } from "./formation.service.js";

export const formationController = {
  async list(_request: Request, response: Response) {
    const formations = await formationService.list();
    response.status(HTTP_STATUS.OK).json(formations);
  },

  async getById(request: Request, response: Response) {
    const formationId = getRouteParam(request.params.id, "id");
    const formation = await formationService.getById(formationId);
    response.status(HTTP_STATUS.OK).json(formation);
  },
};
