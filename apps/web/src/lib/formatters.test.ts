import { describe, expect, it } from "vitest";

import { mapApiRecommendationToRecord } from "./formatters";
import type { ApiRecommendation } from "../types/ui";

const recommendationFixture: ApiRecommendation = {
  id: "rec-1",
  matchWeekId: "week-1",
  formationId: "formation-1",
  generatedById: "admin-1",
  status: "FINAL",
  summary: "Backend summary text",
  ruleScoreSummary: "Backend rule summary",
  mlSupportSummary: "ML support advisory text",
  createdAt: "2026-04-24T12:00:00.000Z",
  updatedAt: "2026-04-24T12:00:00.000Z",
  formation: {
    id: "formation-1",
    code: "4-3-3",
    label: "4-3-3",
    defenders: 4,
    midfielders: 3,
    forwards: 3,
    isActive: true,
    createdAt: "2026-04-24T12:00:00.000Z",
    updatedAt: "2026-04-24T12:00:00.000Z",
  },
  matchWeek: {
    id: "week-1",
    label: "Week 1",
    opponentName: "Lagos Mariners",
    matchDate: "2026-04-30T16:00:00.000Z",
    status: "READY",
    notes: "Prepared",
    createdAt: "2026-04-24T12:00:00.000Z",
    updatedAt: "2026-04-24T12:00:00.000Z",
  },
  generatedBy: {
    id: "admin-1",
    fullName: "Development Coach Admin",
    email: "admin@club.local",
  },
  recommendationPlayers: [
    {
      id: "rp-1",
      recommendationId: "rec-1",
      playerId: "p1",
      role: "FORWARD",
      startingPosition: "forward-1: ST",
      isSelected: true,
      computedScore: 91.2,
      selectionReason: "Selected based on training 9/10, fitness 90/100, morale 88/100, fatigue 10/100.",
      exclusionReason: null,
      rankOrder: 1,
      createdAt: "2026-04-24T12:00:00.000Z",
      player: {
        id: "p1",
        fullName: "Michael Etim",
        squadNumber: 9,
        primaryPosition: "ST",
        secondaryPosition: null,
        positionGroup: "FORWARD",
        preferredFoot: "RIGHT",
        age: 29,
        heightCm: 182,
        status: "ACTIVE",
        createdAt: "2026-04-24T12:00:00.000Z",
        updatedAt: "2026-04-24T12:00:00.000Z",
      },
    },
    {
      id: "rp-2",
      recommendationId: "rec-1",
      playerId: "p2",
      role: "EXCLUDED",
      startingPosition: null,
      isSelected: false,
      computedScore: 0,
      selectionReason: null,
      exclusionReason: "Excluded because the player is injured.",
      rankOrder: 12,
      createdAt: "2026-04-24T12:00:00.000Z",
      player: {
        id: "p2",
        fullName: "Leon Chukwu",
        squadNumber: 14,
        primaryPosition: "LB",
        secondaryPosition: null,
        positionGroup: "DEFENDER",
        preferredFoot: "LEFT",
        age: 26,
        heightCm: 178,
        status: "INJURED",
        createdAt: "2026-04-24T12:00:00.000Z",
        updatedAt: "2026-04-24T12:00:00.000Z",
      },
    },
  ],
};

describe("formatters", () => {
  it("maps backend recommendation payloads into UI-friendly recommendation records", () => {
    const result = mapApiRecommendationToRecord(recommendationFixture);

    expect(result.formation).toBe("4-3-3");
    expect(result.status).toBe("READY");
    expect(result.lineup[0]).toMatchObject({
      fullName: "Michael Etim",
      squadNumber: 9,
      positionLabel: "ST",
    });
    expect(result.excludedPlayers[0]).toMatchObject({
      fullName: "Leon Chukwu",
      reason: "Excluded because the player is injured.",
      status: "INJURED",
    });
    expect(result.explanationHighlights[0]).toContain("Michael Etim");
  });
});
