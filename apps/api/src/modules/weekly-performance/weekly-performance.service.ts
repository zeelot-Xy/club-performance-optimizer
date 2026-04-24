import type { Prisma } from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

export const weeklyPerformanceService = {
  async listByMatchWeek(matchWeekId: string) {
    const matchWeek = await prisma.matchWeek.findUnique({
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

  async create(input: Prisma.WeeklyPerformanceUncheckedCreateInput) {
    const [matchWeek, player] = await Promise.all([
      prisma.matchWeek.findUnique({ where: { id: input.matchWeekId } }),
      prisma.player.findUnique({ where: { id: input.playerId } }),
    ]);

    if (!matchWeek) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Match week not found.");
    }

    if (!player) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Player not found.");
    }

    return prisma.weeklyPerformance.create({
      data: input,
      include: {
        player: true,
        matchWeek: true,
      },
    });
  },

  async update(id: string, input: Prisma.WeeklyPerformanceUncheckedUpdateInput) {
    const existingRecord = await prisma.weeklyPerformance.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Weekly performance record not found.");
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
