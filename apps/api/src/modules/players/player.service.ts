import type { Prisma } from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { clubService } from "../clubs/club.service.js";

export const playerService = {
  async list(userId?: string) {
    if (!userId) {
      return prisma.player.findMany({
        orderBy: [{ squadNumber: "asc" }],
      });
    }

    const club = await clubService.getCurrent(userId);

    if (!club) {
      return [];
    }

    return prisma.player.findMany({
      where: { clubId: club.id },
      orderBy: [{ squadNumber: "asc" }],
    });
  },

  async getById(id: string, userId?: string) {
    const player = userId
      ? await prisma.player.findFirst({
          where: {
            id,
            clubId: (await clubService.requireActiveClub(userId)).id,
          },
        })
      : await prisma.player.findUnique({
          where: { id },
        });

    if (!player) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Player not found.");
    }

    return player;
  },

  async getDetails(id: string, userIdOrMatchWeekId?: string, matchWeekIdArg?: string) {
    const userId = matchWeekIdArg ? userIdOrMatchWeekId : undefined;
    const matchWeekId = matchWeekIdArg ?? userIdOrMatchWeekId;
    const player = await this.getById(id, userId);
    const club = userId ? await clubService.requireActiveClub(userId) : null;

    const weeklyPerformance = matchWeekId
      ? club
        ? await prisma.weeklyPerformance.findFirst({
            where: {
              playerId: id,
              matchWeekId,
              matchWeek: {
                clubId: club.id,
              },
            },
            include: {
              matchWeek: true,
            },
          })
        : await prisma.weeklyPerformance.findUnique({
            where: {
              matchWeekId_playerId: {
                matchWeekId,
                playerId: id,
              },
            },
            include: {
              matchWeek: true,
            },
          })
      : await prisma.weeklyPerformance.findFirst({
          where: {
            playerId: id,
            ...(club
              ? {
                  matchWeek: {
                    clubId: club.id,
                  },
                }
              : {}),
          },
          include: {
            matchWeek: true,
          },
          orderBy: [{ matchWeek: { matchDate: "desc" } }, { createdAt: "desc" }],
        });

    return {
      player,
      weeklyPerformance,
      matchWeek: weeklyPerformance?.matchWeek ?? null,
    };
  },

  async create(userId: string | undefined, input: Prisma.PlayerUncheckedCreateInput) {
    if (!userId) {
      return prisma.player.create({ data: input });
    }

    const club = await clubService.requireActiveClub(userId);

    return prisma.player.create({
      data: {
        ...input,
        clubId: club.id,
      },
    });
  },

  async update(id: string, userId: string | undefined, input: Prisma.PlayerUncheckedUpdateInput) {
    await this.getById(id, userId);

    return prisma.player.update({
      where: { id },
      data: input,
    });
  },
};
