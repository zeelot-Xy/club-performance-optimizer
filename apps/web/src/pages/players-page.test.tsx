import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlayersPage } from "./players-page";

const usePlayersMock = vi.fn();
const usePlayerDetailsMock = vi.fn();

vi.mock("../hooks/use-players", () => ({
  usePlayers: () => usePlayersMock(),
}));

vi.mock("../hooks/use-player-details", () => ({
  usePlayerDetails: (playerId?: string | null, matchWeekId?: string | null) =>
    usePlayerDetailsMock(playerId, matchWeekId),
}));

describe("PlayersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlayersMock.mockReturnValue({
      data: [
        {
          id: "player-1",
          fullName: "Samuel Okafor",
          squadNumber: 9,
          primaryPosition: "Centre Forward",
          secondaryPosition: "Right Wing",
          positionGroup: "FORWARD",
          preferredFoot: "RIGHT",
          age: 24,
          heightCm: 181,
          status: "ACTIVE",
          createdAt: "2026-04-24T12:00:00.000Z",
          updatedAt: "2026-04-24T12:00:00.000Z",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      createPlayer: {
        isPending: false,
        isError: false,
        error: null,
        mutateAsync: vi.fn(),
      },
    });
    usePlayerDetailsMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it("opens the player stats modal when a player is clicked in the list", () => {
    usePlayerDetailsMock.mockReturnValue({
      data: {
        player: {
          id: "player-1",
          fullName: "Samuel Okafor",
          squadNumber: 9,
          primaryPosition: "Centre Forward",
          secondaryPosition: "Right Wing",
          positionGroup: "FORWARD",
          preferredFoot: "RIGHT",
          age: 24,
          heightCm: 181,
          status: "ACTIVE",
          createdAt: "2026-04-24T12:00:00.000Z",
          updatedAt: "2026-04-24T12:00:00.000Z",
        },
        weeklyPerformance: null,
        matchWeek: null,
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<PlayersPage />);

    fireEvent.click(screen.getByRole("button", { name: /samuel okafor/i }));

    expect(screen.getByRole("dialog", { name: /samuel okafor/i })).toBeInTheDocument();
    expect(screen.getByText(/No weekly stats recorded yet/i)).toBeInTheDocument();
  });
});
