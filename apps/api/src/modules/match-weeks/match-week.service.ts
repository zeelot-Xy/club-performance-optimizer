import type { Prisma } from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { clubService } from "../clubs/club.service.js";

export const matchWeekService = {
  async list(userId?: string) {
    if (!userId) {
      return prisma.matchWeek.findMany({
        orderBy: [{ matchDate: "desc" }],
        include: {
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });
    }

    const club = await clubService.getCurrent(userId);

    if (!club) {
      return [];
    }

    return prisma.matchWeek.findMany({
      where: { clubId: club.id },
      orderBy: [{ matchDate: "desc" }],
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  },

  async getById(id: string, userId?: string) {
    const matchWeek = userId
      ? await prisma.matchWeek.findFirst({
          where: {
            id,
            clubId: (await clubService.requireActiveClub(userId)).id,
          },
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
        })
      : await prisma.matchWeek.findUnique({
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

  async create(userId: string | undefined, input: Prisma.MatchWeekUncheckedCreateInput) {
    if (!userId) {
      return prisma.matchWeek.create({ data: input });
    }

    const club = await clubService.requireActiveClub(userId);

    return prisma.matchWeek.create({
      data: {
        ...input,
        clubId: club.id,
      },
    });
  },

  async update(id: string, userId: string | undefined, input: Prisma.MatchWeekUncheckedUpdateInput) {
    await this.getById(id, userId);

    return prisma.matchWeek.update({
      where: { id },
      data: input,
    });
  },
};
