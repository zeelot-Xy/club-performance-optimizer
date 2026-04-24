import { Prisma } from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

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
};
