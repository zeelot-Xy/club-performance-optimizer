import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { clubProviderClient } from "./club.provider.js";

const ensureUserExists = async (userId: string) => {
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    include: {
      activeClub: true,
    },
  });

  if (!user) {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, "Authenticated user no longer exists.");
  }

  return user;
};

const buildSquadNumberMap = (numbers: Array<number | null | undefined>) => {
  const usedNumbers = new Set(numbers.filter((value): value is number => typeof value === "number"));

  let nextFallback = 1;

  return {
    resolve(preferred?: number | null) {
      if (preferred && !usedNumbers.has(preferred)) {
        usedNumbers.add(preferred);
        return preferred;
      }

      while (usedNumbers.has(nextFallback)) {
        nextFallback += 1;
      }

      usedNumbers.add(nextFallback);
      return nextFallback;
    },
  };
};

export const clubService = {
  list() {
    return prisma.club.findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    });
  },

  async getCurrent(userId: string) {
    const user = await ensureUserExists(userId);
    return user.activeClub ?? null;
  },

  async requireActiveClub(userId: string) {
    const club = await this.getCurrent(userId);

    if (!club) {
      throw new HttpError(
        HTTP_STATUS.BAD_REQUEST,
        "No active club is selected. Import or activate a club first.",
      );
    }

    return club;
  },

  async search(query: string) {
    return clubProviderClient.searchClubs(query);
  },

  async activate(userId: string, clubId: string) {
    const user = await ensureUserExists(userId);
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Club not found.");
    }

    await prisma.$transaction([
      prisma.club.updateMany({
        data: { isActive: false },
        where: { isActive: true },
      }),
      prisma.club.update({
        where: { id: club.id },
        data: { isActive: true },
      }),
      prisma.adminUser.update({
        where: { id: user.id },
        data: { activeClubId: club.id },
      }),
    ]);

    return prisma.club.findUniqueOrThrow({
      where: { id: club.id },
    });
  },

  async import(userId: string, provider: "football-data" | "thesportsdb", externalClubId: string) {
    await ensureUserExists(userId);

    const imported = await clubProviderClient.importClub(provider, externalClubId);

    const existingClub = await prisma.club.findUnique({
      where: {
        provider_externalClubId: {
          provider: imported.club.provider,
          externalClubId: imported.club.externalClubId,
        },
      },
    });

    const club = await prisma.club.upsert({
      where: {
        provider_externalClubId: {
          provider: imported.club.provider,
          externalClubId: imported.club.externalClubId,
        },
      },
      update: {
        name: imported.club.name,
        shortName: imported.club.shortName,
        country: imported.club.country,
        competition: imported.club.competition,
        crestUrl: imported.club.crestUrl,
      },
      create: {
        name: imported.club.name,
        shortName: imported.club.shortName,
        provider: imported.club.provider,
        externalClubId: imported.club.externalClubId,
        country: imported.club.country,
        competition: imported.club.competition,
        crestUrl: imported.club.crestUrl,
      },
    });

    const existingPlayers = await prisma.player.findMany({
      where: { clubId: club.id },
      select: {
        id: true,
        squadNumber: true,
      },
    });

    if (!existingClub && imported.players.length) {
      const squadNumbers = buildSquadNumberMap(existingPlayers.map((player) => player.squadNumber));

      await prisma.player.createMany({
        data: imported.players.map((player) => ({
          clubId: club.id,
          fullName: player.fullName,
          squadNumber: squadNumbers.resolve(player.squadNumber),
          primaryPosition: player.primaryPosition,
          positionGroup: player.positionGroup,
          preferredFoot: "UNKNOWN",
          age: player.age,
          status: "ACTIVE",
        })),
      });
    }

    return this.activate(userId, club.id);
  },
};

