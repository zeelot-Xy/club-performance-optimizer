import type { Prisma } from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { clubService } from "../clubs/club.service.js";

const buildRecentPerformanceSummary = (
  stats: Array<{
    minutes: number | null;
    goals: number;
    assists: number;
    rating: number | null;
    cleanSheet: boolean | null;
    saves: number | null;
  }>,
) => {
  const matchesConsidered = stats.length;
  const totalMinutes = stats.reduce((sum, stat) => sum + (stat.minutes ?? 0), 0);
  const totalGoals = stats.reduce((sum, stat) => sum + stat.goals, 0);
  const totalAssists = stats.reduce((sum, stat) => sum + stat.assists, 0);
  const totalSaves = stats.reduce((sum, stat) => sum + (stat.saves ?? 0), 0);
  const cleanSheets = stats.filter((stat) => stat.cleanSheet).length;
  const ratedMatches = stats.filter((stat) => stat.rating !== null);

  return {
    matchesConsidered,
    totalMinutes,
    totalGoals,
    totalAssists,
    totalSaves,
    cleanSheets,
    averageRating: ratedMatches.length
      ? Number(
          (
            ratedMatches.reduce((sum, stat) => sum + (stat.rating ?? 0), 0) / ratedMatches.length
          ).toFixed(2),
        )
      : null,
  };
};

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

    const recentPerformanceHistory = await prisma.importedPlayerStat.findMany({
      where: {
        playerId: id,
        ...(club
          ? {
              clubId: club.id,
            }
          : {}),
      },
      include: {
        importedMatch: true,
      },
      orderBy: {
        importedMatch: {
          matchDate: "desc",
        },
      },
      take: 5,
    });

    const recentPerformanceSummary = buildRecentPerformanceSummary(recentPerformanceHistory);

    return {
      player,
      weeklyPerformance,
      matchWeek: weeklyPerformance?.matchWeek ?? null,
      recentPerformanceSummary,
      recentPerformanceHistory: recentPerformanceHistory.map((entry) => ({
        id: entry.id,
        matchDate: entry.importedMatch.matchDate,
        opponentName: entry.importedMatch.opponentName,
        competition: entry.importedMatch.competition,
        venue: entry.importedMatch.venue,
        result: entry.importedMatch.result,
        minutes: entry.minutes,
        goals: entry.goals,
        assists: entry.assists,
        rating: entry.rating,
        cleanSheet: entry.cleanSheet,
        saves: entry.saves,
        yellowCards: entry.yellowCards,
        redCards: entry.redCards,
      })),
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
