import {
  AvailabilityStatus,
  InjuryStatus,
  MatchWeekStatus,
  PlayerStatus,
  Prisma,
  SuspensionStatus,
} from "@prisma/client";

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

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const buildSquadNumberResolver = (numbers: Array<number | null | undefined>) => {
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

const summarizeClub = async (clubId: string) => {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
  });

  if (!club) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, "Club not found.");
  }

  const [playerCount, importedMatchCount, importedPlayerStatCount, baselineWeeklyCount] =
    await Promise.all([
      prisma.player.count({ where: { clubId } }),
      prisma.importedMatch.count({ where: { clubId } }),
      prisma.importedPlayerStat.count({ where: { clubId } }),
      prisma.weeklyPerformance.count({
        where: {
          player: { clubId },
          isGeneratedBaseline: true,
        },
      }),
    ]);

  return {
    ...club,
    importSummary: {
      playerCount,
      importedMatchCount,
      importedPlayerStatCount,
      baselineWeeklyCount,
    },
  };
};

const getOrCreatePlanningWeek = async (clubId: string, createdById: string) => {
  const existing = await prisma.matchWeek.findFirst({
    where: {
      clubId,
      status: {
        in: [MatchWeekStatus.DRAFT, MatchWeekStatus.READY],
      },
    },
    orderBy: [{ matchDate: "asc" }, { createdAt: "asc" }],
  });

  if (existing) {
    return existing;
  }

  return prisma.matchWeek.create({
    data: {
      clubId,
      createdById,
      label: "Initial Planning Week",
      opponentName: "Opponent pending",
      matchDate: new Date(),
      status: MatchWeekStatus.READY,
      notes:
        "System-generated planning cycle created after club import. Review and refine weekly readiness before match decisions.",
    },
  });
};

const buildBaselineFromStats = (
  playerName: string,
  stats: Array<{
    minutes?: number | null;
    goals: number;
    assists: number;
    rating?: number | null;
    cleanSheet?: boolean | null;
    saves?: number | null;
    yellowCards: number;
    redCards: number;
    started?: boolean | null;
  }>,
) => {
  const totalMatches = stats.length;
  const totalMinutes = stats.reduce((sum, stat) => sum + (stat.minutes ?? 0), 0);
  const averageMinutes = totalMatches ? totalMinutes / totalMatches : 0;
  const totalGoals = stats.reduce((sum, stat) => sum + stat.goals, 0);
  const totalAssists = stats.reduce((sum, stat) => sum + stat.assists, 0);
  const totalSaves = stats.reduce((sum, stat) => sum + (stat.saves ?? 0), 0);
  const cleanSheets = stats.filter((stat) => stat.cleanSheet).length;
  const yellowCards = stats.reduce((sum, stat) => sum + stat.yellowCards, 0);
  const redCards = stats.reduce((sum, stat) => sum + stat.redCards, 0);
  const averageRating =
    totalMatches && stats.some((stat) => stat.rating !== null && stat.rating !== undefined)
      ? stats.reduce((sum, stat) => sum + (stat.rating ?? 6.8), 0) / totalMatches
      : null;

  const recentFormBoost =
    totalGoals * 5 +
    totalAssists * 4 +
    cleanSheets * 3 +
    Math.min(totalSaves, 12) * 0.8 -
    yellowCards * 2 -
    redCards * 12;

  const trainingRating = clamp(
    Math.round((averageRating ?? 6.8) + recentFormBoost / 20),
    5,
    10,
  );
  const fitness = clamp(Math.round(82 - Math.max(0, averageMinutes - 70) * 0.35), 58, 96);
  const fatigue = clamp(Math.round(18 + averageMinutes * 0.45), 10, 88);
  const morale = clamp(Math.round(68 + recentFormBoost), 42, 96);
  const suspensionStatus =
    redCards > 0 ? SuspensionStatus.SUSPENDED : SuspensionStatus.ELIGIBLE;

  const sourceSummary =
    totalMatches > 0
      ? `${playerName} baseline derived from ${totalMatches} recent imported matches with ${Math.round(
          averageMinutes,
        )} average minutes, ${totalGoals} goals, and ${totalAssists} assists.`
      : `${playerName} baseline generated from controlled defaults because recent provider stats were limited.`;

  return {
    trainingRating,
    fitness,
    fatigue,
    morale,
    availability: AvailabilityStatus.AVAILABLE,
    injuryStatus: InjuryStatus.FIT,
    suspensionStatus,
    sourceSummary,
  };
};

const synchronizeBaselineWeeklyData = async (clubId: string, createdById: string) => {
  const planningWeek = await getOrCreatePlanningWeek(clubId, createdById);
  const players = await prisma.player.findMany({
    where: {
      clubId,
      status: {
        not: PlayerStatus.INACTIVE,
      },
    },
    include: {
      importedPlayerStats: {
        include: {
          importedMatch: true,
        },
        orderBy: {
          importedMatch: {
            matchDate: "desc",
          },
        },
        take: 5,
      },
    },
    orderBy: [{ squadNumber: "asc" }],
  });

  const existingRecords = await prisma.weeklyPerformance.findMany({
    where: { matchWeekId: planningWeek.id },
  });
  const existingByPlayerId = new Map(existingRecords.map((record) => [record.playerId, record]));

  let baselineUpdatedCount = 0;

  for (const player of players) {
    const baseline = buildBaselineFromStats(
      player.fullName,
      player.importedPlayerStats.map((stat) => ({
        minutes: stat.minutes,
        goals: stat.goals,
        assists: stat.assists,
        rating: stat.rating,
        cleanSheet: stat.cleanSheet,
        saves: stat.saves,
        yellowCards: stat.yellowCards,
        redCards: stat.redCards,
        started: stat.started,
      })),
    );

    const existing = existingByPlayerId.get(player.id);

    if (existing && !existing.isGeneratedBaseline) {
      continue;
    }

    baselineUpdatedCount += 1;

    if (existing) {
      await prisma.weeklyPerformance.update({
        where: { id: existing.id },
        data: {
          ...baseline,
          isGeneratedBaseline: true,
          coachNotes:
            baseline.sourceSummary +
            " This baseline can be edited manually by the coach before final recommendation review.",
        },
      });
    } else {
      await prisma.weeklyPerformance.create({
        data: {
          matchWeekId: planningWeek.id,
          playerId: player.id,
          ...baseline,
          isGeneratedBaseline: true,
          coachNotes:
            baseline.sourceSummary +
            " This baseline can be edited manually by the coach before final recommendation review.",
        },
      });
    }
  }

  return {
    planningWeek,
    baselineUpdatedCount,
  };
};

export const clubService = {
  async list() {
    const clubs = await prisma.club.findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    });

    return Promise.all(clubs.map((club) => summarizeClub(club.id)));
  },

  async getCurrent(userId: string) {
    const user = await ensureUserExists(userId);

    if (!user.activeClubId) {
      return null;
    }

    return summarizeClub(user.activeClubId);
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

    return summarizeClub(club.id);
  },

  async import(userId: string, provider: "football-data" | "thesportsdb", externalClubId: string) {
    await ensureUserExists(userId);

    const imported = await clubProviderClient.importClub(provider, externalClubId);

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
      orderBy: [{ squadNumber: "asc" }],
    });
    const existingByExternalId = new Map(
      existingPlayers
        .filter((player) => player.externalPlayerId)
        .map((player) => [player.externalPlayerId as string, player]),
    );
    const existingByName = new Map(
      existingPlayers.map((player) => [normalizeKey(player.fullName), player]),
    );
    const squadNumbers = buildSquadNumberResolver(existingPlayers.map((player) => player.squadNumber));

    const importedPlayerIdsByKey = new Map<string, string>();

    for (const player of imported.players) {
      const existing =
        (player.externalPlayerId && existingByExternalId.get(player.externalPlayerId)) ||
        existingByName.get(normalizeKey(player.fullName));

      const data: Prisma.PlayerUncheckedCreateInput = {
        clubId: club.id,
        externalPlayerId: player.externalPlayerId ?? null,
        fullName: player.fullName,
        squadNumber: existing?.squadNumber ?? squadNumbers.resolve(player.squadNumber),
        primaryPosition: player.primaryPosition,
        secondaryPosition: player.secondaryPosition ?? null,
        positionGroup: player.positionGroup,
        preferredFoot: player.preferredFoot,
        age: player.age,
        heightCm: player.heightCm ?? null,
        nationality: player.nationality ?? null,
        profileImageUrl: player.profileImageUrl ?? null,
        status: PlayerStatus.ACTIVE,
      };

      const storedPlayer = existing
        ? await prisma.player.update({
            where: { id: existing.id },
            data,
          })
        : await prisma.player.create({
            data,
          });

      importedPlayerIdsByKey.set(normalizeKey(player.fullName), storedPlayer.id);
      if (player.externalPlayerId) {
        importedPlayerIdsByKey.set(player.externalPlayerId, storedPlayer.id);
      }
    }

    await prisma.importedPlayerStat.deleteMany({
      where: { clubId: club.id },
    });
    await prisma.importedMatch.deleteMany({
      where: { clubId: club.id },
    });

    const createdMatches = await Promise.all(
      imported.recentMatches.map((match) =>
        prisma.importedMatch.create({
          data: {
            clubId: club.id,
            externalMatchId: match.externalMatchId,
            sourceProvider: match.sourceProvider,
            opponentName: match.opponentName,
            competition: match.competition ?? null,
            matchDate: new Date(match.matchDate),
            venue: match.venue ?? null,
            isHome: match.isHome,
            result: match.result ?? null,
            goalsFor: match.goalsFor ?? null,
            goalsAgainst: match.goalsAgainst ?? null,
          },
        }),
      ),
    );

    const importedMatchIdByExternalId = new Map(
      createdMatches.map((match) => [match.externalMatchId, match.id]),
    );

    let importedPlayerStatCount = 0;

    for (const stat of imported.playerStats) {
      const playerId =
        (stat.externalPlayerId ? importedPlayerIdsByKey.get(stat.externalPlayerId) : undefined) ||
        importedPlayerIdsByKey.get(normalizeKey(stat.playerName));
      const importedMatchId = importedMatchIdByExternalId.get(stat.externalMatchId);

      if (!playerId || !importedMatchId) {
        continue;
      }

      importedPlayerStatCount += 1;

      await prisma.importedPlayerStat.create({
        data: {
          clubId: club.id,
          playerId,
          importedMatchId,
          sourceProvider: stat.sourceProvider,
          minutes: stat.minutes ?? null,
          goals: stat.goals,
          assists: stat.assists,
          rating: stat.rating ?? null,
          cleanSheet: stat.cleanSheet ?? null,
          saves: stat.saves ?? null,
          yellowCards: stat.yellowCards,
          redCards: stat.redCards,
          started: stat.started ?? null,
          wasSubstitute: stat.wasSubstitute ?? null,
        },
      });
    }

    const { planningWeek, baselineUpdatedCount } = await synchronizeBaselineWeeklyData(club.id, userId);
    const activeClub = await this.activate(userId, club.id);

    return {
      club: activeClub,
      importSummary: {
        playerCount: imported.players.length,
        importedMatchCount: createdMatches.length,
        importedPlayerStatCount,
        baselineWeeklyCount: baselineUpdatedCount,
        planningWeekId: planningWeek.id,
      },
      providerDiagnostics: imported.providerDiagnostics,
    };
  },
};
