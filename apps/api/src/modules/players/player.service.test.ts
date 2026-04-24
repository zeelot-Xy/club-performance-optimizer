import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpError } from "../../lib/http-error.js";

const prismaMock = {
  player: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
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
});
