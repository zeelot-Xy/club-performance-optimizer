import type { Prisma } from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

export const playerService = {
  list() {
    return prisma.player.findMany({
      orderBy: [{ squadNumber: "asc" }],
    });
  },

  async getById(id: string) {
    const player = await prisma.player.findUnique({ where: { id } });

    if (!player) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Player not found.");
    }

    return player;
  },

  async create(input: Prisma.PlayerUncheckedCreateInput) {
    return prisma.player.create({ data: input });
  },

  async update(id: string, input: Prisma.PlayerUncheckedUpdateInput) {
    await this.getById(id);

    return prisma.player.update({
      where: { id },
      data: input,
    });
  },
};
