import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../config/http.js";
import { getRouteParam } from "../../lib/get-route-param.js";
import { generateRecommendationSchema } from "./recommendation.schema.js";
import { recommendationService } from "./recommendation.service.js";

export const recommendationController = {
  async list(request: Request, response: Response) {
    const recommendations = await recommendationService.list(request.auth!.userId);
    response.status(HTTP_STATUS.OK).json(recommendations);
  },

  async getById(request: Request, response: Response) {
    const recommendationId = getRouteParam(request.params.id, "id");
    const recommendation = await recommendationService.getById(recommendationId, request.auth!.userId);
    response.status(HTTP_STATUS.OK).json(recommendation);
  },

  async getByMatchWeek(request: Request, response: Response) {
    const matchWeekId = getRouteParam(request.params.matchWeekId, "matchWeekId");
    const recommendations = await recommendationService.getByMatchWeek(matchWeekId, request.auth!.userId);
    response.status(HTTP_STATUS.OK).json(recommendations);
  },

  async generate(request: Request, response: Response) {
    const payload = generateRecommendationSchema.parse(request.body);
    const recommendation = await recommendationService.generate(
      payload.matchWeekId,
      request.auth!.userId,
    );

    response.status(HTTP_STATUS.CREATED).json(recommendation);
  },
};
