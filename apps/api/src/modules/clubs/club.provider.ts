import { PreferredFoot } from "@prisma/client";

import { env } from "../../config/env.js";
import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";

type ProviderName = "football-data" | "thesportsdb";

type SportsDbSearchTeam = {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string | null;
  strCountry?: string | null;
  strLeague?: string | null;
  strBadge?: string | null;
};

type SportsDbPlayer = {
  idPlayer?: string | null;
  strPlayer: string;
  strPosition?: string | null;
  strHeight?: string | null;
  dateBorn?: string | null;
  strNumber?: string | null;
  strNationality?: string | null;
  strThumb?: string | null;
};

type SportsDbEvent = {
  idEvent: string;
  strEvent?: string | null;
  strLeague?: string | null;
  dateEvent?: string | null;
  strVenue?: string | null;
  idHomeTeam?: string | null;
  idAwayTeam?: string | null;
  strHomeTeam?: string | null;
  strAwayTeam?: string | null;
  intHomeScore?: string | null;
  intAwayScore?: string | null;
};

type SportsDbEventPlayer = {
  idPlayer?: string | null;
  strPlayer?: string | null;
  strPosition?: string | null;
  strStarter?: string | null;
  strSubstitute?: string | null;
  intGoals?: string | null;
  intAssists?: string | null;
  intYellowCards?: string | null;
  intRedCards?: string | null;
  intMinutes?: string | null;
  strRating?: string | null;
  intSaves?: string | null;
  strCleanSheet?: string | null;
};

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
    externalPlayerId?: string | null;
    fullName: string;
    primaryPosition: string;
    secondaryPosition?: string | null;
    positionGroup: "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD";
    preferredFoot: PreferredFoot;
    age: number;
    heightCm?: number | null;
    nationality?: string | null;
    profileImageUrl?: string | null;
    squadNumber?: number | null;
  }>;
  recentMatches: Array<{
    externalMatchId: string;
    sourceProvider: ProviderName;
    opponentName: string;
    competition?: string | null;
    matchDate: string;
    venue?: string | null;
    isHome: boolean;
    result?: string | null;
    goalsFor?: number | null;
    goalsAgainst?: number | null;
  }>;
  playerStats: Array<{
    externalMatchId: string;
    sourceProvider: ProviderName;
    playerName: string;
    externalPlayerId?: string | null;
    minutes?: number | null;
    goals: number;
    assists: number;
    rating?: number | null;
    cleanSheet?: boolean | null;
    saves?: number | null;
    yellowCards: number;
    redCards: number;
    started?: boolean | null;
    wasSubstitute?: boolean | null;
  }>;
  providerDiagnostics: string[];
};

const normalizeCompetition = (value?: string | null) => (value?.trim() ? value.trim() : null);
const normalizeCountry = (value?: string | null) => (value?.trim() ? value.trim() : null);

const normalizeHeight = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const numeric = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(numeric) ? numeric : null;
};

const parseNumber = (value?: string | number | null) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (!value) {
    return null;
  }

  const numeric = Number.parseFloat(String(value));
  return Number.isFinite(numeric) ? numeric : null;
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

const inferPreferredFoot = (_value?: string | null) => PreferredFoot.UNKNOWN;

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
    throw new HttpError(HTTP_STATUS.BAD_GATEWAY, "TheSportsDB search is unavailable right now.");
  }

  const payload = (await response.json()) as { teams?: SportsDbSearchTeam[] };

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

const mapResultLabel = (
  isHome: boolean,
  goalsFor?: number | null,
  goalsAgainst?: number | null,
) => {
  if (goalsFor === null || goalsAgainst === null || goalsFor === undefined || goalsAgainst === undefined) {
    return null;
  }

  if (goalsFor === goalsAgainst) {
    return "Draw";
  }

  const won = goalsFor > goalsAgainst;
  return won ? (isHome ? "Home win" : "Away win") : isHome ? "Home loss" : "Away loss";
};

const fetchSportsDbEventPlayers = async (eventId: string) => {
  const response = await fetch(
    `${env.THESPORTSDB_API_BASE_URL}/lookupeventplayers.php?id=${encodeURIComponent(eventId)}`,
  );

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as {
    playerstats?: SportsDbEventPlayer[];
    player?: SportsDbEventPlayer[];
  };

  return payload.playerstats ?? payload.player ?? [];
};

const importFromTheSportsDb = async (externalClubId: string): Promise<ClubImportPayload> => {
  const [clubResponse, squadResponse, recentMatchesResponse] = await Promise.all([
    fetch(`${env.THESPORTSDB_API_BASE_URL}/lookupteam.php?id=${encodeURIComponent(externalClubId)}`),
    fetch(`${env.THESPORTSDB_API_BASE_URL}/lookup_all_players.php?id=${encodeURIComponent(externalClubId)}`),
    fetch(`${env.THESPORTSDB_API_BASE_URL}/eventslast.php?id=${encodeURIComponent(externalClubId)}`),
  ]);

  if (!clubResponse.ok || !squadResponse.ok || !recentMatchesResponse.ok) {
    throw new HttpError(
      HTTP_STATUS.BAD_GATEWAY,
      "TheSportsDB import endpoints are unavailable right now.",
    );
  }

  const diagnostics: string[] = [];
  const clubPayload = (await clubResponse.json()) as { teams?: SportsDbSearchTeam[] };
  const squadPayload = (await squadResponse.json()) as { player?: SportsDbPlayer[] };
  const recentMatchesPayload = (await recentMatchesResponse.json()) as { results?: SportsDbEvent[] };

  const club = clubPayload.teams?.[0];

  if (!club) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, "The selected club could not be found.");
  }

  const squad = squadPayload.player ?? [];
  if (!squad.length) {
    diagnostics.push("Squad import returned no player rows from TheSportsDB.");
  }

  const recentMatches = (recentMatchesPayload.results ?? []).slice(0, 5);
  if (!recentMatches.length) {
    diagnostics.push("Recent match history was not returned by TheSportsDB.");
  }

  const eventPlayerStatPayloads = await Promise.all(
    recentMatches.map(async (match) => ({
      eventId: match.idEvent,
      players: await fetchSportsDbEventPlayers(match.idEvent),
    })),
  );

  if (!eventPlayerStatPayloads.some((entry) => entry.players.length)) {
    diagnostics.push("Per-player recent match stats were not returned for the imported fixtures.");
  }

  const normalizedMatches = recentMatches.map((match) => {
    const isHome = match.idHomeTeam === externalClubId;
    const goalsFor = parseNumber(isHome ? match.intHomeScore : match.intAwayScore);
    const goalsAgainst = parseNumber(isHome ? match.intAwayScore : match.intHomeScore);

    return {
      externalMatchId: match.idEvent,
      sourceProvider: "thesportsdb" as const,
      opponentName: isHome
        ? match.strAwayTeam ?? "Unknown opponent"
        : match.strHomeTeam ?? "Unknown opponent",
      competition: normalizeCompetition(match.strLeague),
      matchDate: match.dateEvent ? new Date(match.dateEvent).toISOString() : new Date().toISOString(),
      venue: match.strVenue ?? null,
      isHome,
      result: mapResultLabel(isHome, goalsFor, goalsAgainst),
      goalsFor,
      goalsAgainst,
    };
  });

  const normalizedPlayers = squad.map((player, index) => ({
    externalPlayerId: player.idPlayer ?? null,
    fullName: player.strPlayer,
    primaryPosition: player.strPosition?.trim() || "General Squad Role",
    secondaryPosition: null,
    positionGroup: inferPositionGroup(player.strPosition),
    preferredFoot: inferPreferredFoot(),
    age: deriveAge(player.dateBorn),
    heightCm: normalizeHeight(player.strHeight),
    nationality: normalizeCountry(player.strNationality),
    profileImageUrl: player.strThumb ?? null,
    squadNumber: player.strNumber ? Number(player.strNumber) || index + 1 : index + 1,
  }));

  const normalizedPlayerStats = eventPlayerStatPayloads.flatMap(({ eventId, players }) =>
    players.map((player) => ({
      externalMatchId: eventId,
      sourceProvider: "thesportsdb" as const,
      playerName: player.strPlayer?.trim() || "Unknown player",
      externalPlayerId: player.idPlayer ?? null,
      minutes: parseNumber(player.intMinutes),
      goals: parseNumber(player.intGoals) ?? 0,
      assists: parseNumber(player.intAssists) ?? 0,
      rating: parseNumber(player.strRating),
      cleanSheet:
        player.strCleanSheet?.toLowerCase() === "yes"
          ? true
          : player.strCleanSheet?.toLowerCase() === "no"
            ? false
            : null,
      saves: parseNumber(player.intSaves),
      yellowCards: parseNumber(player.intYellowCards) ?? 0,
      redCards: parseNumber(player.intRedCards) ?? 0,
      started:
        player.strStarter?.toLowerCase() === "yes"
          ? true
          : player.strStarter?.toLowerCase() === "no"
            ? false
            : null,
      wasSubstitute:
        player.strSubstitute?.toLowerCase() === "yes"
          ? true
          : player.strSubstitute?.toLowerCase() === "no"
            ? false
            : null,
    })),
  );

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
    players: normalizedPlayers,
    recentMatches: normalizedMatches,
    playerStats: normalizedPlayerStats,
    providerDiagnostics: diagnostics,
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

  const [teamResponse, matchesResponse] = await Promise.all([
    fetch(`${env.FOOTBALL_DATA_API_BASE_URL}/teams/${encodeURIComponent(externalClubId)}`, { headers }),
    fetch(`${env.FOOTBALL_DATA_API_BASE_URL}/teams/${encodeURIComponent(externalClubId)}/matches?status=FINISHED`, { headers }),
  ]);

  if (!teamResponse.ok || !matchesResponse.ok) {
    throw new HttpError(
      HTTP_STATUS.BAD_GATEWAY,
      "football-data.org import is unavailable right now.",
    );
  }

  const diagnostics: string[] = [
    "football-data.org does not expose player-level recent stat lines in the same depth as specialist statistics providers.",
  ];

  const teamPayload = (await teamResponse.json()) as {
    id: number;
    name: string;
    shortName?: string | null;
    area?: { name?: string | null };
    runningCompetitions?: Array<{ name?: string | null }>;
    crest?: string | null;
    squad?: Array<{
      id?: number;
      name: string;
      position?: string | null;
      dateOfBirth?: string | null;
      nationality?: string | null;
    }>;
  };
  const matchesPayload = (await matchesResponse.json()) as {
    matches?: Array<{
      id: number;
      utcDate: string;
      competition?: { name?: string | null };
      homeTeam?: { id?: number; name?: string | null };
      awayTeam?: { id?: number; name?: string | null };
      score?: {
        fullTime?: { home?: number | null; away?: number | null };
        winner?: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
      };
      venue?: string | null;
    }>;
  };

  const normalizedPlayers = (teamPayload.squad ?? []).map((player, index) => ({
    externalPlayerId: player.id ? String(player.id) : null,
    fullName: player.name,
    primaryPosition: player.position?.trim() || "General Squad Role",
    secondaryPosition: null,
    positionGroup: inferPositionGroup(player.position),
    preferredFoot: PreferredFoot.UNKNOWN,
    age: deriveAge(player.dateOfBirth),
    heightCm: null,
    nationality: normalizeCountry(player.nationality),
    profileImageUrl: null,
    squadNumber: index + 1,
  }));

  const recentMatches = (matchesPayload.matches ?? []).slice(0, 5).map((match) => {
    const isHome = match.homeTeam?.id === teamPayload.id;
    const goalsFor = isHome ? match.score?.fullTime?.home ?? null : match.score?.fullTime?.away ?? null;
    const goalsAgainst = isHome ? match.score?.fullTime?.away ?? null : match.score?.fullTime?.home ?? null;

    return {
      externalMatchId: String(match.id),
      sourceProvider: "football-data" as const,
      opponentName: isHome
        ? match.awayTeam?.name ?? "Unknown opponent"
        : match.homeTeam?.name ?? "Unknown opponent",
      competition: normalizeCompetition(match.competition?.name),
      matchDate: match.utcDate,
      venue: match.venue ?? null,
      isHome,
      result:
        match.score?.winner === "DRAW"
          ? "Draw"
          : goalsFor !== null && goalsAgainst !== null && goalsFor > goalsAgainst
            ? isHome ? "Home win" : "Away win"
            : isHome ? "Home loss" : "Away loss",
      goalsFor,
      goalsAgainst,
    };
  });

  if (!normalizedPlayers.length) {
    diagnostics.push("football-data.org did not return squad members for this club.");
  }

  if (!recentMatches.length) {
    diagnostics.push("football-data.org did not return recent finished matches for this club.");
  }

  return {
    club: {
      provider: "football-data",
      externalClubId: String(teamPayload.id),
      name: teamPayload.name,
      shortName: teamPayload.shortName ?? null,
      country: normalizeCountry(teamPayload.area?.name),
      competition: normalizeCompetition(teamPayload.runningCompetitions?.[0]?.name),
      crestUrl: teamPayload.crest ?? null,
    },
    players: normalizedPlayers,
    recentMatches,
    playerStats: [],
    providerDiagnostics: diagnostics,
  };
};

export const clubProviderClient = {
  async searchClubs(query: string): Promise<ClubSearchResult[]> {
    return searchWithTheSportsDb(query);
  },

  async importClub(provider: ProviderName, externalClubId: string) {
    if (provider === "football-data") {
      return importFromFootballData(externalClubId);
    }

    return importFromTheSportsDb(externalClubId);
  },
};
