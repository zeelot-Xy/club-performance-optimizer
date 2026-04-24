import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../config/http.js";
import { getRouteParam } from "../../lib/get-route-param.js";
import { createPlayerSchema, updatePlayerSchema } from "./player.schema.js";
import { playerService } from "./player.service.js";

export const playerController = {
  async list(_request: Request, response: Response) {
    const players = await playerService.list();
    response.status(HTTP_STATUS.OK).json(players);
  },

  async getById(request: Request, response: Response) {
    const playerId = getRouteParam(request.params.id, "id");
    const player = await playerService.getById(playerId);
    response.status(HTTP_STATUS.OK).json(player);
  },

  async create(request: Request, response: Response) {
    const payload = createPlayerSchema.parse(request.body);
    const player = await playerService.create(payload);
    response.status(HTTP_STATUS.CREATED).json(player);
  },

  async update(request: Request, response: Response) {
    const playerId = getRouteParam(request.params.id, "id");
    const payload = updatePlayerSchema.parse(request.body);
    const player = await playerService.update(playerId, payload);
    response.status(HTTP_STATUS.OK).json(player);
  },
};
