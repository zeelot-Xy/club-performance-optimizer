import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../config/http.js";
import { getRouteParam } from "../../lib/get-route-param.js";
import {
  createWeeklyPerformanceSchema,
  updateWeeklyPerformanceSchema,
} from "./weekly-performance.schema.js";
import { weeklyPerformanceService } from "./weekly-performance.service.js";

export const weeklyPerformanceController = {
  async listByMatchWeek(request: Request, response: Response) {
    const matchWeekId = getRouteParam(request.params.matchWeekId, "matchWeekId");
    const records = await weeklyPerformanceService.listByMatchWeek(matchWeekId, request.auth!.userId);
    response.status(HTTP_STATUS.OK).json(records);
  },

  async create(request: Request, response: Response) {
    const payload = createWeeklyPerformanceSchema.parse(request.body);
    const record = await weeklyPerformanceService.create(request.auth!.userId, payload);
    response.status(HTTP_STATUS.CREATED).json(record);
  },

  async update(request: Request, response: Response) {
    const weeklyPerformanceId = getRouteParam(request.params.id, "id");
    const payload = updateWeeklyPerformanceSchema.parse(request.body);
    const record = await weeklyPerformanceService.update(weeklyPerformanceId, request.auth!.userId, payload);
    response.status(HTTP_STATUS.OK).json(record);
  },
};
