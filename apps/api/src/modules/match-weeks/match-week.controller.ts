import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../config/http.js";
import { getRouteParam } from "../../lib/get-route-param.js";
import { createMatchWeekSchema, updateMatchWeekSchema } from "./match-week.schema.js";
import { matchWeekService } from "./match-week.service.js";

export const matchWeekController = {
  async list(_request: Request, response: Response) {
    const matchWeeks = await matchWeekService.list();
    response.status(HTTP_STATUS.OK).json(matchWeeks);
  },

  async getById(request: Request, response: Response) {
    const matchWeekId = getRouteParam(request.params.id, "id");
    const matchWeek = await matchWeekService.getById(matchWeekId);
    response.status(HTTP_STATUS.OK).json(matchWeek);
  },

  async create(request: Request, response: Response) {
    const payload = createMatchWeekSchema.parse(request.body);
    const matchWeek = await matchWeekService.create({
      ...payload,
      createdById: request.auth!.userId,
    });
    response.status(HTTP_STATUS.CREATED).json(matchWeek);
  },

  async update(request: Request, response: Response) {
    const matchWeekId = getRouteParam(request.params.id, "id");
    const payload = updateMatchWeekSchema.parse(request.body);
    const matchWeek = await matchWeekService.update(matchWeekId, payload);
    response.status(HTTP_STATUS.OK).json(matchWeek);
  },
};
