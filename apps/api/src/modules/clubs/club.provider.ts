import { env } from "../../config/env.js";
import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";

type ProviderName = "football-data" | "thesportsdb";

export type ClubSearchResult = {
  provider: ProviderName;
  externalClubId: string;
  name: string;
  shortName?: string | null;
  country?: string | null;
  competition?: string | null;
  crestUrl?: string | null;
};

export type ClubImportPayload = {
  club: {
    provider: ProviderName;
    externalClubId: string;
    name: string;
    shortName?: string | null;
    country?: string | null;
    competition?: string | null;
    crestUrl?: string | null;
  };
  players: Array<{
    fullName: string;
    primaryPosition: string;
    positionGroup: "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD";
    age: number;
    squadNumber?: number | null;
  }>;
};

const normalizeCompetition = (value?: string | null) =>
  value?.trim() ? value.trim() : null;

const normalizeCountry = (value?: string | null) =>
  value?.trim() ? value.trim() : null;

const inferPositionGroup = (value?: string | null) => {
  const position = value?.toLowerCase() ?? "";

  if (position.includes("keeper") || position === "gk") {
    return "GOALKEEPER" as const;
  }

  if (
    position.includes("back") ||
    position.includes("defend") ||
    position.includes("centre-back") ||
    position.includes("full-back") ||
    position === "cb" ||
    position === "rb" ||
    position === "lb"
  ) {
    return "DEFENDER" as const;
  }

  if (
    position.includes("mid") ||
    position.includes("wing") ||
    position === "cm" ||
    position === "dm" ||
    position === "am"
  ) {
    return "MIDFIELDER" as const;
  }

  return "FORWARD" as const;
};

const deriveAge = (dateOfBirth?: string | null) => {
  if (!dateOfBirth) {
    return 24;
  }

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return 24;
  }

  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return Math.max(age, 16);
};

const buildFootballDataHeaders = () => {
  if (!env.FOOTBALL_DATA_API_KEY) {
    return null;
  }

  return {
    "X-Auth-Token": env.FOOTBALL_DATA_API_KEY,
  };
};

const searchWithTheSportsDb = async (query: string): Promise<ClubSearchResult[]> => {
  const response = await fetch(
    `${env.THESPORTSDB_API_BASE_URL}/searchteams.php?t=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new HttpError(
      HTTP_STATUS.BAD_GATEWAY,
      "TheSportsDB search is unavailable right now.",
    );
  }

  const payload = (await response.json()) as {
    teams?: Array<{
      idTeam: string;
      strTeam: string;
      strTeamShort?: string | null;
      strCountry?: string | null;
      strLeague?: string | null;
      strBadge?: string | null;
    }>;
  };

  return (payload.teams ?? []).map((team) => ({
    provider: "thesportsdb",
    externalClubId: team.idTeam,
    name: team.strTeam,
    shortName: team.strTeamShort ?? null,
    country: normalizeCountry(team.strCountry),
    competition: normalizeCompetition(team.strLeague),
    crestUrl: team.strBadge ?? null,
  }));
};

const importFromTheSportsDb = async (externalClubId: string): Promise<ClubImportPayload> => {
  const [clubResponse, squadResponse] = await Promise.all([
    fetch(`${env.THESPORTSDB_API_BASE_URL}/lookupteam.php?id=${encodeURIComponent(externalClubId)}`),
    fetch(`${env.THESPORTSDB_API_BASE_URL}/lookup_all_players.php?id=${encodeURIComponent(externalClubId)}`),
  ]);

  if (!clubResponse.ok || !squadResponse.ok) {
    throw new HttpError(
      HTTP_STATUS.BAD_GATEWAY,
      "TheSportsDB import endpoint is unavailable right now.",
    );
  }

  const clubPayload = (await clubResponse.json()) as {
    teams?: Array<{
      idTeam: string;
      strTeam: string;
      strTeamShort?: string | null;
      strCountry?: string | null;
      strLeague?: string | null;
      strBadge?: string | null;
    }>;
  };
  const squadPayload = (await squadResponse.json()) as {
    player?: Array<{
      strPlayer: string;
      strPosition?: string | null;
      dateBorn?: string | null;
      strNumber?: string | null;
    }>;
  };

  const club = clubPayload.teams?.[0];

  if (!club) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, "The selected club could not be found.");
  }

  return {
    club: {
      provider: "thesportsdb",
      externalClubId: club.idTeam,
      name: club.strTeam,
      shortName: club.strTeamShort ?? null,
      country: normalizeCountry(club.strCountry),
      competition: normalizeCompetition(club.strLeague),
      crestUrl: club.strBadge ?? null,
    },
    players: (squadPayload.player ?? []).map((player) => ({
      fullName: player.strPlayer,
      primaryPosition: player.strPosition?.trim() || "General Squad Role",
      positionGroup: inferPositionGroup(player.strPosition),
      age: deriveAge(player.dateBorn),
      squadNumber: player.strNumber ? Number(player.strNumber) || null : null,
    })),
  };
};

const importFromFootballData = async (externalClubId: string): Promise<ClubImportPayload> => {
  const headers = buildFootballDataHeaders();

  if (!headers) {
    throw new HttpError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      "football-data.org integration requires FOOTBALL_DATA_API_KEY.",
    );
  }

  const response = await fetch(
    `${env.FOOTBALL_DATA_API_BASE_URL}/teams/${encodeURIComponent(externalClubId)}`,
    { headers },
  );

  if (!response.ok) {
    throw new HttpError(
      HTTP_STATUS.BAD_GATEWAY,
      "football-data.org import is unavailable right now.",
    );
  }

  const payload = (await response.json()) as {
    id: number;
    name: string;
    shortName?: string | null;
    area?: { name?: string | null };
    runningCompetitions?: Array<{ name?: string | null }>;
    crest?: string | null;
    squad?: Array<{
      name: string;
      position?: string | null;
      dateOfBirth?: string | null;
      shirtNumber?: number | null;
    }>;
  };

  return {
    club: {
      provider: "football-data",
      externalClubId: String(payload.id),
      name: payload.name,
      shortName: payload.shortName ?? null,
      country: normalizeCountry(payload.area?.name),
      competition: normalizeCompetition(payload.runningCompetitions?.[0]?.name),
      crestUrl: payload.crest ?? null,
    },
    players: (payload.squad ?? []).map((player) => ({
      fullName: player.name,
      primaryPosition: player.position?.trim() || "General Squad Role",
      positionGroup: inferPositionGroup(player.position),
      age: deriveAge(player.dateOfBirth),
      squadNumber: player.shirtNumber ?? null,
    })),
  };
};

export const clubProviderClient = {
  async searchClubs(query: string): Promise<ClubSearchResult[]> {
    const results = await searchWithTheSportsDb(query);

    if (results.length) {
      return results;
    }

    if (!env.FOOTBALL_DATA_API_KEY) {
      return [];
    }

    throw new HttpError(
      HTTP_STATUS.NOT_FOUND,
      "No club matched that search term in the configured provider.",
    );
  },

  async importClub(provider: ProviderName, externalClubId: string) {
    if (provider === "football-data") {
      return importFromFootballData(externalClubId);
    }

    return importFromTheSportsDb(externalClubId);
  },
};

