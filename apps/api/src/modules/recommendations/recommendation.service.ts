import { Prisma } from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { aiServiceClient } from "../../lib/ai-service.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { clubService } from "../clubs/club.service.js";
import {
  generateRecommendationFromWeeklyData,
  validateMatchWeekReady,
} from "./recommendation-engine.js";

const recommendationInclude = {
  formation: true,
  matchWeek: true,
  generatedBy: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
  recommendationPlayers: {
    include: {
      player: true,
    },
    orderBy: [{ isSelected: "desc" }, { rankOrder: "asc" }],
  },
} satisfies Prisma.RecommendationInclude;

const formatRecommendation = (
  recommendation: Prisma.RecommendationGetPayload<{ include: typeof recommendationInclude }>,
) => ({
  ...recommendation,
  recommendationPlayers: recommendation.recommendationPlayers.map((playerEntry) => ({
    ...playerEntry,
    computedScore: Number(playerEntry.computedScore),
  })),
});

export const recommendationService = {
  async list(userId?: string) {
    const club = userId ? await clubService.getCurrent(userId) : null;

    if (userId && !club) {
      return [];
    }

    const recommendations = await prisma.recommendation.findMany({
      where: club
        ? {
            matchWeek: {
              clubId: club.id,
            },
          }
        : undefined,
      include: recommendationInclude,
      orderBy: [{ createdAt: "desc" }],
    });

    return recommendations.map(formatRecommendation);
  },

  async getById(id: string, userId?: string) {
    const club = userId ? await clubService.requireActiveClub(userId) : null;
    const recommendation = club
      ? await prisma.recommendation.findFirst({
          where: {
            id,
            matchWeek: {
              clubId: club.id,
            },
          },
          include: recommendationInclude,
        })
      : await prisma.recommendation.findUnique({
          where: { id },
          include: recommendationInclude,
        });

    if (!recommendation) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Recommendation not found.");
    }

    return formatRecommendation(recommendation);
  },

  async getByMatchWeek(matchWeekId: string, userId?: string) {
    const club = userId ? await clubService.requireActiveClub(userId) : null;
    const recommendations = await prisma.recommendation.findMany({
      where: club
        ? {
            matchWeekId,
            matchWeek: {
              clubId: club.id,
            },
          }
        : { matchWeekId },
      include: recommendationInclude,
      orderBy: [{ createdAt: "desc" }],
    });

    if (!recommendations.length) {
      throw new HttpError(
        HTTP_STATUS.NOT_FOUND,
        "No recommendation has been stored for this match week yet.",
      );
    }

    return recommendations.map(formatRecommendation);
  },

  async buildMlSupportSummary(
    selectedPlayers: Prisma.RecommendationGetPayload<{
      include: typeof recommendationInclude;
    }>["recommendationPlayers"],
    weeklyPerformances: Array<
      Prisma.WeeklyPerformanceGetPayload<{
        include: {
          player: true;
        };
      }>
    >,
  ) {
    try {
      const weeklyPerformanceByPlayerId = new Map(
        weeklyPerformances.map((record) => [record.playerId, record] as const),
      );

      const predictionResults = await Promise.all(
        selectedPlayers
          .filter((playerEntry) => playerEntry.isSelected)
          .map(async (playerEntry) => {
            const weeklyRecord = weeklyPerformanceByPlayerId.get(playerEntry.player.id);

            if (!weeklyRecord) {
              throw new Error("Weekly record missing for selected player.");
            }

            const prediction = await aiServiceClient.predictPlayerScore({
              playerId: playerEntry.player.id,
              positionGroup: playerEntry.player.positionGroup,
              trainingRating: weeklyRecord.trainingRating,
              fitness: weeklyRecord.fitness,
              fatigue: weeklyRecord.fatigue,
              morale: weeklyRecord.morale,
              availability: weeklyRecord.availability,
              injuryStatus: weeklyRecord.injuryStatus,
              suspensionStatus: weeklyRecord.suspensionStatus,
              age: playerEntry.player.age,
            });

            return `${playerEntry.player.fullName}: ${prediction.predicted_score} (${prediction.model_name})`;
          }),
      );

      return `ML support scores for selected players: ${predictionResults.join("; ")}`;
    } catch {
      return "ML support unavailable for this recommendation run.";
    }
  },

  async generate(matchWeekId: string, generatedById: string) {
    const club = await clubService.requireActiveClub(generatedById);
    const matchWeek = await prisma.matchWeek.findFirst({
      where: {
        id: matchWeekId,
        clubId: club.id,
      },
      include: {
        weeklyPerformances: {
          include: {
            player: true,
          },
        },
      },
    });

    if (!matchWeek) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Match week not found.");
    }

    validateMatchWeekReady(matchWeek.status);

    const formations = await prisma.formation.findMany({
      where: { isActive: true },
      orderBy: [{ defenders: "asc" }, { midfielders: "asc" }, { forwards: "asc" }],
    });

    if (!formations.length) {
      throw new HttpError(
        HTTP_STATUS.BAD_REQUEST,
        "No active formations are available for recommendation generation.",
      );
    }

    const generatedRecommendation = generateRecommendationFromWeeklyData(
      matchWeek.label,
      matchWeek.weeklyPerformances,
      formations,
    );

    const recommendation = await prisma.recommendation.create({
      data: {
        matchWeekId,
        formationId: generatedRecommendation.formationId,
        generatedById,
        status: generatedRecommendation.status,
        summary: generatedRecommendation.summary,
        ruleScoreSummary: generatedRecommendation.ruleScoreSummary,
        mlSupportSummary: generatedRecommendation.mlSupportSummary,
        recommendationPlayers: {
          create: generatedRecommendation.recommendationPlayers.map((entry) => ({
            playerId: entry.playerId,
            role: entry.role,
            startingPosition: entry.startingPosition,
            isSelected: entry.isSelected,
            computedScore: entry.computedScore,
            selectionReason: entry.selectionReason,
            exclusionReason: entry.exclusionReason,
            rankOrder: entry.rankOrder,
          })),
        },
      },
      include: recommendationInclude,
    });

    const mlSupportSummary = await this.buildMlSupportSummary(
      recommendation.recommendationPlayers,
      matchWeek.weeklyPerformances,
    );

    const updatedRecommendation = await prisma.recommendation.update({
      where: { id: recommendation.id },
      data: {
        mlSupportSummary,
      },
      include: recommendationInclude,
    });

    return formatRecommendation(updatedRecommendation);
  },
};
