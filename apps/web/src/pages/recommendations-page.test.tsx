import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { RecommendationsPage } from "./recommendations-page";

const useFormationsMock = vi.fn();
const useMatchWeeksMock = vi.fn();
const useRecommendationsMock = vi.fn();
const usePlayerDetailsMock = vi.fn();
const useClubsMock = vi.fn();

vi.mock("../hooks/use-formations", () => ({
  useFormations: () => useFormationsMock(),
}));

vi.mock("../hooks/use-match-weeks", () => ({
  useMatchWeeks: () => useMatchWeeksMock(),
}));

vi.mock("../hooks/use-recommendations", () => ({
  useRecommendations: (matchWeekId?: string) => useRecommendationsMock(matchWeekId),
}));

vi.mock("../hooks/use-player-details", () => ({
  usePlayerDetails: (playerId?: string | null, matchWeekId?: string | null) =>
    usePlayerDetailsMock(playerId, matchWeekId),
}));

vi.mock("../hooks/use-clubs", () => ({
  useClubs: () => useClubsMock(),
}));

describe("RecommendationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlayerDetailsMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    });
    useClubsMock.mockReturnValue({
      currentClubQuery: {
        data: { id: "club-1", name: "Manchester United" },
      },
    });
    useFormationsMock.mockReturnValue({
      data: [{ id: "formation-1", code: "4-3-3" }],
      isLoading: false,
    });
  });

  it("renders the empty recommendation state when no recommendation exists for the selected week", async () => {
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

    expect(
      await screen.findByText(/No recommendation stored for this match week yet/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate recommendation/i })).toBeInTheDocument();
  });

  it("renders backend recommendation details and triggers generation when requested", async () => {
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

    expect(await screen.findByText(/The backend selected 4-3-3/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Michael Etim/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Generate recommendation/i }));
    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith("week-1");
    });
  });

  it("opens the same player details modal when a pitch marker is clicked", () => {
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
      generateRecommendation: { mutate: vi.fn(), isPending: false, isError: false, error: null },
    });
    usePlayerDetailsMock.mockReturnValue({
      data: {
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
        weeklyPerformance: {
          id: "wp-1",
          matchWeekId: "week-1",
          playerId: "p1",
          trainingRating: 9,
          fitness: 90,
          fatigue: 10,
          morale: 88,
          availability: "AVAILABLE",
          injuryStatus: "FIT",
          suspensionStatus: "ELIGIBLE",
          coachNotes: "Sharp in training.",
          createdAt: "2026-04-24T12:00:00.000Z",
          updatedAt: "2026-04-24T12:00:00.000Z",
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
        recentPerformanceSummary: {
          matchesConsidered: 0,
          totalMinutes: 0,
          totalGoals: 0,
          totalAssists: 0,
          totalSaves: 0,
          cleanSheets: 0,
          averageRating: null,
        },
        recentPerformanceHistory: [],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<RecommendationsPage />);

    fireEvent.click(screen.getByRole("button", { name: /open details for michael etim/i }));

    expect(screen.getByRole("dialog", { name: /michael etim/i })).toBeInTheDocument();
    expect(screen.getByText(/Sharp in training/i)).toBeInTheDocument();
  });
});
