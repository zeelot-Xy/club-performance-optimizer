import type { Prisma } from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

export const matchWeekService = {
  list() {
    return prisma.matchWeek.findMany({
      orderBy: [{ matchDate: "desc" }],
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  },

  async getById(id: string) {
    const matchWeek = await prisma.matchWeek.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
        weeklyPerformances: {
          include: {
            player: true,
          },
          orderBy: {
            player: { squadNumber: "asc" },
          },
        },
      },
    });

    if (!matchWeek) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Match week not found.");
    }

    return matchWeek;
  },

  create(input: Prisma.MatchWeekUncheckedCreateInput) {
    return prisma.matchWeek.create({ data: input });
  },

  async update(id: string, input: Prisma.MatchWeekUncheckedUpdateInput) {
    await this.getById(id);

    return prisma.matchWeek.update({
      where: { id },
      data: input,
    });
  },
};
