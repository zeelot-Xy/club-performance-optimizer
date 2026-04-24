import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { RecommendationsPage } from "./recommendations-page";

const useFormationsMock = vi.fn();
const useMatchWeeksMock = vi.fn();
const useRecommendationsMock = vi.fn();

vi.mock("../hooks/use-formations", () => ({
  useFormations: () => useFormationsMock(),
}));

vi.mock("../hooks/use-match-weeks", () => ({
  useMatchWeeks: () => useMatchWeeksMock(),
}));

vi.mock("../hooks/use-recommendations", () => ({
  useRecommendations: (matchWeekId?: string) => useRecommendationsMock(matchWeekId),
}));

describe("RecommendationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFormationsMock.mockReturnValue({
      data: [{ id: "formation-1", code: "4-3-3" }],
      isLoading: false,
    });
  });

  it("renders the empty recommendation state when no recommendation exists for the selected week", () => {
    useMatchWeeksMock.mockReturnValue({
      data: [
        {
          id: "week-1",
          label: "Week 1",
          opponentName: "Lagos Mariners",
          matchDate: "2026-04-30T16:00:00.000Z",
          status: "READY",
          notes: "Prepared",
          createdAt: "2026-04-24T12:00:00.000Z",
          updatedAt: "2026-04-24T12:00:00.000Z",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });
    useRecommendationsMock.mockReturnValue({
      byMatchWeekQuery: { data: null, isLoading: false, isError: false, error: null },
      generateRecommendation: { mutate: vi.fn(), isPending: false, isError: false, error: null },
    });

    render(<RecommendationsPage />);

    expect(screen.getByText(/No recommendation stored for this match week yet/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate recommendation/i })).toBeInTheDocument();
  });

  it("renders backend recommendation details and triggers generation when requested", () => {
    const mutate = vi.fn();

    useMatchWeeksMock.mockReturnValue({
      data: [
        {
          id: "week-1",
          label: "Week 1",
          opponentName: "Lagos Mariners",
          matchDate: "2026-04-30T16:00:00.000Z",
          status: "READY",
          notes: "Prepared",
          createdAt: "2026-04-24T12:00:00.000Z",
          updatedAt: "2026-04-24T12:00:00.000Z",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });
    useRecommendationsMock.mockReturnValue({
      byMatchWeekQuery: {
        data: {
          id: "rec-1",
          matchWeekId: "week-1",
          formationId: "formation-1",
          generatedById: "admin-1",
          status: "FINAL",
          summary: "The backend selected 4-3-3.",
          ruleScoreSummary: "Rule-based summary.",
          mlSupportSummary: "ML support advisory.",
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
          ],
        },
        isLoading: false,
        isError: false,
        error: null,
      },
      generateRecommendation: { mutate, isPending: false, isError: false, error: null },
    });

    render(<RecommendationsPage />);

    expect(screen.getByText(/The backend selected 4-3-3/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Michael Etim/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Generate recommendation/i }));
    expect(mutate).toHaveBeenCalledWith("week-1");
  });
});
