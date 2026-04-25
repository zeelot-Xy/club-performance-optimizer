import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpError } from "../../lib/http-error.js";

const prismaMock = {
  player: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  weeklyPerformance: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
  },
};

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

describe("playerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists players ordered by squad number", async () => {
    prismaMock.player.findMany.mockResolvedValue([{ id: "p1" }]);

    const { playerService } = await import("./player.service.js");
    const result = await playerService.list();

    expect(prismaMock.player.findMany).toHaveBeenCalledWith({
      orderBy: [{ squadNumber: "asc" }],
    });
    expect(result).toEqual([{ id: "p1" }]);
  });

  it("throws when player cannot be found", async () => {
    prismaMock.player.findUnique.mockResolvedValue(null);

    const { playerService } = await import("./player.service.js");

    await expect(playerService.getById("missing")).rejects.toBeInstanceOf(HttpError);
    await expect(playerService.getById("missing")).rejects.toMatchObject({
      message: "Player not found.",
    });
  });

  it("returns player details with match-week-specific weekly performance when matchWeekId is provided", async () => {
    prismaMock.player.findUnique.mockResolvedValue({ id: "p1", fullName: "Player One" });
    prismaMock.weeklyPerformance.findUnique.mockResolvedValue({
      id: "wp1",
      trainingRating: 8,
      matchWeek: { id: "week-1", label: "Week 1" },
    });

    const { playerService } = await import("./player.service.js");
    const result = await playerService.getDetails("p1", "week-1");

    expect(prismaMock.weeklyPerformance.findUnique).toHaveBeenCalledWith({
      where: {
        matchWeekId_playerId: {
          matchWeekId: "week-1",
          playerId: "p1",
        },
      },
      include: {
        matchWeek: true,
      },
    });
    expect(result).toMatchObject({
      player: { id: "p1" },
      weeklyPerformance: { id: "wp1" },
      matchWeek: { id: "week-1" },
    });
  });

  it("returns latest available weekly performance when matchWeekId is omitted", async () => {
    prismaMock.player.findUnique.mockResolvedValue({ id: "p1", fullName: "Player One" });
    prismaMock.weeklyPerformance.findFirst.mockResolvedValue({
      id: "wp-latest",
      matchWeek: { id: "week-2", label: "Week 2" },
    });

    const { playerService } = await import("./player.service.js");
    const result = await playerService.getDetails("p1");

    expect(prismaMock.weeklyPerformance.findFirst).toHaveBeenCalledWith({
      where: { playerId: "p1" },
      include: {
        matchWeek: true,
      },
      orderBy: [{ matchWeek: { matchDate: "desc" } }, { createdAt: "desc" }],
    });
    expect(result).toMatchObject({
      player: { id: "p1" },
      weeklyPerformance: { id: "wp-latest" },
      matchWeek: { id: "week-2" },
    });
  });

  it("returns null weekly performance details when no record exists", async () => {
    prismaMock.player.findUnique.mockResolvedValue({ id: "p1", fullName: "Player One" });
    prismaMock.weeklyPerformance.findUnique.mockResolvedValue(null);

    const { playerService } = await import("./player.service.js");
    const result = await playerService.getDetails("p1", "week-1");

    expect(result).toMatchObject({
      player: { id: "p1" },
      weeklyPerformance: null,
      matchWeek: null,
    });
  });
});
