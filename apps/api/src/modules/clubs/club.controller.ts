import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../config/http.js";
import { getRouteParam } from "../../lib/get-route-param.js";
import { clubSearchQuerySchema, importClubSchema } from "./club.schema.js";
import { clubService } from "./club.service.js";

export const clubController = {
  async list(_request: Request, response: Response) {
    const clubs = await clubService.list();
    response.status(HTTP_STATUS.OK).json(clubs);
  },

  async getCurrent(request: Request, response: Response) {
    const club = await clubService.getCurrent(request.auth!.userId);
    response.status(HTTP_STATUS.OK).json(club);
  },

  async search(request: Request, response: Response) {
    const { q } = clubSearchQuerySchema.parse(request.query);
    const clubs = await clubService.search(q);
    response.status(HTTP_STATUS.OK).json(clubs);
  },

  async import(request: Request, response: Response) {
    const payload = importClubSchema.parse(request.body);
    const club = await clubService.import(
      request.auth!.userId,
      payload.provider,
      payload.externalClubId,
    );
    response.status(HTTP_STATUS.CREATED).json(club);
  },

  async activate(request: Request, response: Response) {
    const clubId = getRouteParam(request.params.id, "id");
    const club = await clubService.activate(request.auth!.userId, clubId);
    response.status(HTTP_STATUS.OK).json(club);
  },
};

