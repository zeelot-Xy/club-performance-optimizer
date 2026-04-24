import { Prisma } from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
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

const formatRecommendation = (recommendation: Prisma.RecommendationGetPayload<{ include: typeof recommendationInclude }>) => ({
  ...recommendation,
  recommendationPlayers: recommendation.recommendationPlayers.map((playerEntry) => ({
    ...playerEntry,
    computedScore: Number(playerEntry.computedScore),
  })),
});

export const recommendationService = {
  async list() {
    const recommendations = await prisma.recommendation.findMany({
      include: recommendationInclude,
      orderBy: [{ createdAt: "desc" }],
    });

    return recommendations.map(formatRecommendation);
  },

  async getById(id: string) {
    const recommendation = await prisma.recommendation.findUnique({
      where: { id },
      include: recommendationInclude,
    });

    if (!recommendation) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Recommendation not found.");
    }

    return formatRecommendation(recommendation);
  },

  async getByMatchWeek(matchWeekId: string) {
    const recommendations = await prisma.recommendation.findMany({
      where: { matchWeekId },
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

  async generate(matchWeekId: string, generatedById: string) {
    const matchWeek = await prisma.matchWeek.findUnique({
      where: { id: matchWeekId },
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

    return formatRecommendation(recommendation);
  },
};
