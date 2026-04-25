import type { Request, Response } from "express";

import { HTTP_STATUS } from "../../config/http.js";
import { getRouteParam } from "../../lib/get-route-param.js";
import { createPlayerSchema, playerDetailsQuerySchema, updatePlayerSchema } from "./player.schema.js";
import { playerService } from "./player.service.js";

export const playerController = {
  async list(request: Request, response: Response) {
    const players = await playerService.list(request.auth!.userId);
    response.status(HTTP_STATUS.OK).json(players);
  },

  async getById(request: Request, response: Response) {
    const playerId = getRouteParam(request.params.id, "id");
    const player = await playerService.getById(playerId, request.auth!.userId);
    response.status(HTTP_STATUS.OK).json(player);
  },

  async getDetails(request: Request, response: Response) {
    const playerId = getRouteParam(request.params.id, "id");
    const { matchWeekId } = playerDetailsQuerySchema.parse(request.query);
    const details = await playerService.getDetails(playerId, request.auth!.userId, matchWeekId);
    response.status(HTTP_STATUS.OK).json(details);
  },

  async create(request: Request, response: Response) {
    const payload = createPlayerSchema.parse(request.body);
    const player = await playerService.create(request.auth!.userId, payload);
    response.status(HTTP_STATUS.CREATED).json(player);
  },

  async update(request: Request, response: Response) {
    const playerId = getRouteParam(request.params.id, "id");
    const payload = updatePlayerSchema.parse(request.body);
    const player = await playerService.update(playerId, request.auth!.userId, payload);
    response.status(HTTP_STATUS.OK).json(player);
  },
};
