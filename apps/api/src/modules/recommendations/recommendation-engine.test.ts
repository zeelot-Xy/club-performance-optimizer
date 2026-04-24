import { describe, expect, it } from "vitest";

import {
  AvailabilityStatus,
  InjuryStatus,
  MatchWeekStatus,
  PlayerStatus,
  PositionGroup,
  RecommendationPlayerRole,
  RecommendationStatus,
  SuspensionStatus,
} from "@prisma/client";

import { HttpError } from "../../lib/http-error.js";
import {
  generateRecommendationFromWeeklyData,
  validateMatchWeekReady,
} from "./recommendation-engine.js";

const formations = [
  {
    id: "formation-433",
    code: "4-3-3",
    label: "4-3-3",
    defenders: 4,
    midfielders: 3,
    forwards: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const buildWeeklyRecord = (
  overrides: Partial<{
    playerId: string;
    squadNumber: number;
    fullName: string;
    primaryPosition: string;
    positionGroup: PositionGroup;
    status: PlayerStatus;
    availability: AvailabilityStatus;
    injuryStatus: InjuryStatus;
    suspensionStatus: SuspensionStatus;
    trainingRating: number;
    fitness: number;
    fatigue: number;
    morale: number;
  }> = {},
) => {
  const positionGroup = overrides.positionGroup ?? PositionGroup.DEFENDER;

  return {
    id: `weekly-${overrides.playerId ?? crypto.randomUUID()}`,
    matchWeekId: "week-1",
    playerId: overrides.playerId ?? crypto.randomUUID(),
    trainingRating: overrides.trainingRating ?? 8,
    fitness: overrides.fitness ?? 85,
    fatigue: overrides.fatigue ?? 20,
    morale: overrides.morale ?? 80,
    availability: overrides.availability ?? AvailabilityStatus.AVAILABLE,
    injuryStatus: overrides.injuryStatus ?? InjuryStatus.FIT,
    suspensionStatus: overrides.suspensionStatus ?? SuspensionStatus.ELIGIBLE,
    coachNotes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    player: {
      id: overrides.playerId ?? crypto.randomUUID(),
      fullName: overrides.fullName ?? "Sample Player",
      squadNumber: overrides.squadNumber ?? 1,
      primaryPosition: overrides.primaryPosition ?? "CB",
      secondaryPosition: null,
      positionGroup,
      preferredFoot: "RIGHT",
      age: 24,
      heightCm: 180,
      status: overrides.status ?? PlayerStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
};

describe("recommendation-engine", () => {
  it("generates a valid recommendation for an eligible squad", () => {
    const weeklyRecords = [
      buildWeeklyRecord({ playerId: "gk-1", squadNumber: 1, fullName: "Goalkeeper", primaryPosition: "GK", positionGroup: PositionGroup.GOALKEEPER }),
      buildWeeklyRecord({ playerId: "df-1", squadNumber: 2, fullName: "Defender 1", primaryPosition: "RB", positionGroup: PositionGroup.DEFENDER }),
      buildWeeklyRecord({ playerId: "df-2", squadNumber: 3, fullName: "Defender 2", primaryPosition: "CB", positionGroup: PositionGroup.DEFENDER }),
      buildWeeklyRecord({ playerId: "df-3", squadNumber: 4, fullName: "Defender 3", primaryPosition: "CB", positionGroup: PositionGroup.DEFENDER }),
      buildWeeklyRecord({ playerId: "df-4", squadNumber: 5, fullName: "Defender 4", primaryPosition: "LB", positionGroup: PositionGroup.DEFENDER }),
      buildWeeklyRecord({ playerId: "mf-1", squadNumber: 6, fullName: "Midfielder 1", primaryPosition: "DM", positionGroup: PositionGroup.MIDFIELDER }),
      buildWeeklyRecord({ playerId: "mf-2", squadNumber: 8, fullName: "Midfielder 2", primaryPosition: "CM", positionGroup: PositionGroup.MIDFIELDER }),
      buildWeeklyRecord({ playerId: "mf-3", squadNumber: 10, fullName: "Midfielder 3", primaryPosition: "AM", positionGroup: PositionGroup.MIDFIELDER }),
      buildWeeklyRecord({ playerId: "fw-1", squadNumber: 7, fullName: "Forward 1", primaryPosition: "RW", positionGroup: PositionGroup.FORWARD }),
      buildWeeklyRecord({ playerId: "fw-2", squadNumber: 9, fullName: "Forward 2", primaryPosition: "ST", positionGroup: PositionGroup.FORWARD }),
      buildWeeklyRecord({ playerId: "fw-3", squadNumber: 11, fullName: "Forward 3", primaryPosition: "LW", positionGroup: PositionGroup.FORWARD }),
      buildWeeklyRecord({ playerId: "reserve", squadNumber: 12, fullName: "Reserve Defender", primaryPosition: "CB", positionGroup: PositionGroup.DEFENDER, trainingRating: 6 }),
    ];

    const recommendation = generateRecommendationFromWeeklyData("Week 1", weeklyRecords as never[], formations as never[]);

    expect(recommendation.status).toBe(RecommendationStatus.FINAL);
    expect(recommendation.formationId).toBe("formation-433");
    expect(recommendation.recommendationPlayers.filter((entry) => entry.isSelected)).toHaveLength(11);
    expect(recommendation.recommendationPlayers.some((entry) => entry.role === RecommendationPlayerRole.EXCLUDED)).toBe(true);
  });

  it("fails when fewer than 11 eligible players are available", () => {
    const weeklyRecords = Array.from({ length: 10 }, (_, index) =>
      buildWeeklyRecord({
        playerId: `player-${index}`,
        squadNumber: index + 1,
        fullName: `Player ${index + 1}`,
        positionGroup:
          index === 0
            ? PositionGroup.GOALKEEPER
            : index < 5
              ? PositionGroup.DEFENDER
              : index < 8
                ? PositionGroup.MIDFIELDER
                : PositionGroup.FORWARD,
      }),
    );

    expect(() =>
      generateRecommendationFromWeeklyData("Week 1", weeklyRecords as never[], formations as never[]),
    ).toThrowError(HttpError);
  });

  it("excludes injured or unavailable players from selection", () => {
    const baseSquad = [
      buildWeeklyRecord({ playerId: "gk-1", squadNumber: 1, fullName: "Goalkeeper", primaryPosition: "GK", positionGroup: PositionGroup.GOALKEEPER }),
      buildWeeklyRecord({ playerId: "df-1", squadNumber: 2, fullName: "Defender 1", primaryPosition: "RB", positionGroup: PositionGroup.DEFENDER }),
      buildWeeklyRecord({ playerId: "df-2", squadNumber: 3, fullName: "Defender 2", primaryPosition: "CB", positionGroup: PositionGroup.DEFENDER }),
      buildWeeklyRecord({ playerId: "df-3", squadNumber: 4, fullName: "Defender 3", primaryPosition: "CB", positionGroup: PositionGroup.DEFENDER }),
      buildWeeklyRecord({ playerId: "df-4", squadNumber: 5, fullName: "Defender 4", primaryPosition: "LB", positionGroup: PositionGroup.DEFENDER }),
      buildWeeklyRecord({ playerId: "df-5", squadNumber: 12, fullName: "Defender 5", primaryPosition: "CB", positionGroup: PositionGroup.DEFENDER }),
      buildWeeklyRecord({ playerId: "mf-1", squadNumber: 6, fullName: "Midfielder 1", primaryPosition: "DM", positionGroup: PositionGroup.MIDFIELDER }),
      buildWeeklyRecord({ playerId: "mf-2", squadNumber: 8, fullName: "Midfielder 2", primaryPosition: "CM", positionGroup: PositionGroup.MIDFIELDER }),
      buildWeeklyRecord({ playerId: "mf-3", squadNumber: 10, fullName: "Midfielder 3", primaryPosition: "AM", positionGroup: PositionGroup.MIDFIELDER }),
      buildWeeklyRecord({ playerId: "fw-1", squadNumber: 7, fullName: "Forward 1", primaryPosition: "RW", positionGroup: PositionGroup.FORWARD }),
      buildWeeklyRecord({ playerId: "fw-2", squadNumber: 9, fullName: "Forward 2", primaryPosition: "ST", positionGroup: PositionGroup.FORWARD }),
      buildWeeklyRecord({ playerId: "fw-3", squadNumber: 11, fullName: "Forward 3", primaryPosition: "LW", positionGroup: PositionGroup.FORWARD }),
      buildWeeklyRecord({
        playerId: "injured-star",
        squadNumber: 14,
        fullName: "Injured Star",
        primaryPosition: "LW",
        positionGroup: PositionGroup.FORWARD,
        injuryStatus: InjuryStatus.INJURED,
        trainingRating: 10,
      }),
    ];

    const recommendation = generateRecommendationFromWeeklyData("Week 1", baseSquad as never[], formations as never[]);
    const injuredEntry = recommendation.recommendationPlayers.find((entry) => entry.playerId === "injured-star");

    expect(injuredEntry?.isSelected).toBe(false);
    expect(injuredEntry?.exclusionReason).toContain("injured");
  });

  it("rejects completed match weeks for generation", () => {
    expect(() => validateMatchWeekReady(MatchWeekStatus.COMPLETED)).toThrowError(HttpError);
  });
});
