import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpError } from "../../lib/http-error.js";

const prismaMock = {
  matchWeek: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

describe("matchWeekService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists match weeks with creator details", async () => {
    prismaMock.matchWeek.findMany.mockResolvedValue([{ id: "mw1" }]);

    const { matchWeekService } = await import("./match-week.service.js");
    const result = await matchWeekService.list();

    expect(prismaMock.matchWeek.findMany).toHaveBeenCalledWith({
      orderBy: [{ matchDate: "desc" }],
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
    expect(result).toEqual([{ id: "mw1" }]);
  });

  it("throws when match week cannot be found", async () => {
    prismaMock.matchWeek.findUnique.mockResolvedValue(null);

    const { matchWeekService } = await import("./match-week.service.js");

    await expect(matchWeekService.getById("missing")).rejects.toBeInstanceOf(HttpError);
    await expect(matchWeekService.getById("missing")).rejects.toMatchObject({
      message: "Match week not found.",
    });
  });
});
