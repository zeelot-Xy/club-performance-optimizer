import type { Prisma } from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { clubService } from "../clubs/club.service.js";

export const weeklyPerformanceService = {
  async listByMatchWeek(matchWeekId: string, userId?: string) {
    const club = userId ? await clubService.requireActiveClub(userId) : null;
    const matchWeek = club
      ? await prisma.matchWeek.findFirst({
          where: {
            id: matchWeekId,
            clubId: club.id,
          },
        })
      : await prisma.matchWeek.findUnique({
          where: { id: matchWeekId },
        });

    if (!matchWeek) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Match week not found.");
    }

    return prisma.weeklyPerformance.findMany({
      where: { matchWeekId },
      include: {
        player: true,
        matchWeek: true,
      },
      orderBy: {
        player: { squadNumber: "asc" },
      },
    });
  },

  async create(userId: string | undefined, input: Prisma.WeeklyPerformanceUncheckedCreateInput) {
    const club = userId ? await clubService.requireActiveClub(userId) : null;
    const [matchWeek, player] = await Promise.all([
      club
        ? prisma.matchWeek.findFirst({
            where: {
              id: input.matchWeekId,
              clubId: club.id,
            },
          })
        : prisma.matchWeek.findUnique({ where: { id: input.matchWeekId } }),
      club
        ? prisma.player.findFirst({
            where: {
              id: input.playerId,
              clubId: club.id,
            },
          })
        : prisma.player.findUnique({ where: { id: input.playerId } }),
    ]);

    if (!matchWeek) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Match week not found.");
    }

    if (!player) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Player not found.");
    }

    if (club && matchWeek.clubId !== player.clubId) {
      throw new HttpError(
        HTTP_STATUS.BAD_REQUEST,
        "Weekly performance records must keep the player and match week inside the same club.",
      );
    }

    return prisma.weeklyPerformance.create({
      data: input,
      include: {
        player: true,
        matchWeek: true,
      },
    });
  },

  async update(id: string, userId: string | undefined, input: Prisma.WeeklyPerformanceUncheckedUpdateInput) {
    const club = userId ? await clubService.requireActiveClub(userId) : null;
    const existingRecord = await prisma.weeklyPerformance.findUnique({
      where: { id },
      include: {
        player: true,
        matchWeek: true,
      },
    });

    if (!existingRecord) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Weekly performance record not found.");
    }

    if (
      club &&
      (existingRecord.player.clubId !== club.id || existingRecord.matchWeek.clubId !== club.id)
    ) {
      throw new HttpError(
        HTTP_STATUS.NOT_FOUND,
        "Weekly performance record not found in the active club workspace.",
      );
    }

    return prisma.weeklyPerformance.update({
      where: { id },
      data: input,
      include: {
        player: true,
        matchWeek: true,
      },
    });
  },
};
