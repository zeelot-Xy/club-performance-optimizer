import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../config/http.js";
import { getRouteParam } from "../../lib/get-route-param.js";
import { recommendationService } from "./recommendation.service.js";

export const recommendationController = {
  async list(_request: Request, response: Response) {
    const recommendations = await recommendationService.list();
    response.status(HTTP_STATUS.OK).json(recommendations);
  },

  async getById(request: Request, response: Response) {
    const recommendationId = getRouteParam(request.params.id, "id");
    const recommendation = await recommendationService.getById(recommendationId);
    response.status(HTTP_STATUS.OK).json(recommendation);
  },

  async getByMatchWeek(request: Request, response: Response) {
    const matchWeekId = getRouteParam(request.params.matchWeekId, "matchWeekId");
    const recommendations = await recommendationService.getByMatchWeek(matchWeekId);
    response.status(HTTP_STATUS.OK).json(recommendations);
  },
};
