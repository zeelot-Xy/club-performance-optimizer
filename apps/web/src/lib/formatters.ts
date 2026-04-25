import type {
  ApiMatchWeek,
  ApiPlayer,
  ApiPlayerDetails,
  ApiRecommendation,
  ExcludedPlayer,
  MatchWeekRecord,
  MatchWeekStatus,
  PlayerRecord,
  PlayerStatsModalRecord,
  PlayerStatus,
  RecommendationRecord,
  RecommendationStatus,
} from "../types/ui";

export const formatDate = (value?: string | null) => {
  if (!value) {
    return "Date not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");

export const playerStatusTone = (status: PlayerStatus) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "INJURED":
      return "danger";
    default:
      return "warning";
  }
};

export const matchWeekStatusTone = (status: MatchWeekStatus) => {
  switch (status) {
    case "READY":
      return "success";
    case "DRAFT":
      return "warning";
    default:
      return "default";
  }
};

export const recommendationStatusTone = (status: RecommendationStatus | RecommendationRecord["status"]) => {
  switch (status) {
    case "FINAL":
    case "READY":
      return "success";
    case "FAILED":
      return "danger";
    default:
      return "warning";
  }
};

export const mapApiPlayerToRecord = (player: ApiPlayer): PlayerRecord => ({
  id: player.id,
  squadNumber: player.squadNumber,
  fullName: player.fullName,
  primaryPosition: player.primaryPosition,
  secondaryPosition: player.secondaryPosition ?? undefined,
  positionGroup: player.positionGroup,
  preferredFoot: player.preferredFoot,
  age: player.age,
  status: player.status,
  readiness: player.status === "ACTIVE" ? 82 : player.status === "INJURED" ? 38 : 58,
});

export const mapApiPlayerDetailsToModalRecord = (
  details: ApiPlayerDetails,
): PlayerStatsModalRecord => ({
  id: details.player.id,
  fullName: details.player.fullName,
  squadNumber: details.player.squadNumber,
  primaryPosition: details.player.primaryPosition,
  secondaryPosition: details.player.secondaryPosition ?? undefined,
  positionGroup: details.player.positionGroup,
  preferredFoot: details.player.preferredFoot,
  age: details.player.age,
  heightCm: details.player.heightCm ?? null,
  status: details.player.status,
  weeklyStats: details.weeklyPerformance
    ? {
        matchWeekLabel: details.matchWeek?.label ?? "Latest available week",
        opponentName: details.matchWeek?.opponentName ?? "Opponent pending",
        matchDate: formatDate(details.matchWeek?.matchDate),
        trainingRating: details.weeklyPerformance.trainingRating,
        fitness: details.weeklyPerformance.fitness,
        fatigue: details.weeklyPerformance.fatigue,
        morale: details.weeklyPerformance.morale,
        availability: details.weeklyPerformance.availability,
        injuryStatus: details.weeklyPerformance.injuryStatus,
        suspensionStatus: details.weeklyPerformance.suspensionStatus,
        coachNotes:
          details.weeklyPerformance.coachNotes ??
          "No coach notes were recorded for this player in the selected week.",
      }
    : null,
  recentPerformanceSummary: details.recentPerformanceSummary,
  recentPerformanceHistory: details.recentPerformanceHistory.map((entry) => ({
    id: entry.id,
    matchDate: formatDate(entry.matchDate),
    opponentName: entry.opponentName,
    competition: entry.competition ?? "Competition not set",
    result: entry.result ?? "Result not available",
    minutes: entry.minutes !== null && entry.minutes !== undefined ? `${entry.minutes} mins` : "Minutes not available",
    goals: entry.goals,
    assists: entry.assists,
    rating: entry.rating !== null && entry.rating !== undefined ? entry.rating.toFixed(1) : "N/A",
    defensiveNote:
      entry.cleanSheet
        ? "Clean sheet recorded"
        : entry.saves
          ? `${entry.saves} saves`
          : "No defensive event recorded",
    discipline: `${entry.yellowCards} YC | ${entry.redCards} RC`,
  })),
});

export const mapApiMatchWeekToRecord = (matchWeek: ApiMatchWeek): MatchWeekRecord => ({
  id: matchWeek.id,
  label: matchWeek.label,
  opponentName: matchWeek.opponentName ?? "Opponent pending",
  matchDate: formatDate(matchWeek.matchDate),
  status: matchWeek.status,
  notes: matchWeek.notes ?? "No coach notes recorded yet for this match week.",
  completion: matchWeek.status === "COMPLETED" ? 100 : matchWeek.status === "READY" ? 88 : 46,
});

const sortSelectedLineup = (recommendation: ApiRecommendation) => {
  const roleOrder = {
    FORWARD: 0,
    MIDFIELDER: 1,
    DEFENDER: 2,
    GOALKEEPER: 3,
    BENCH: 4,
    EXCLUDED: 5,
  } as const;

  return recommendation.recommendationPlayers
    .filter((playerEntry) => playerEntry.isSelected)
    .sort((left, right) => {
      const leftRole = roleOrder[left.role];
      const rightRole = roleOrder[right.role];

      if (leftRole !== rightRole) {
        return leftRole - rightRole;
      }

      return (left.rankOrder ?? 999) - (right.rankOrder ?? 999);
    });
};

const mapExcludedPlayer = (recommendation: ApiRecommendation): ExcludedPlayer[] =>
  recommendation.recommendationPlayers
    .filter((playerEntry) => !playerEntry.isSelected)
    .sort((left, right) => (left.rankOrder ?? 999) - (right.rankOrder ?? 999))
    .map((playerEntry) => ({
      id: playerEntry.player.id,
      fullName: playerEntry.player.fullName,
      squadNumber: playerEntry.player.squadNumber,
      reason: playerEntry.exclusionReason ?? "Excluded from the final XI for this recommendation run.",
      status: playerEntry.player.status,
    }));

export const mapApiRecommendationToRecord = (
  recommendation: ApiRecommendation,
): RecommendationRecord => {
  const selectedPlayers = sortSelectedLineup(recommendation);

  return {
    id: recommendation.id,
    matchWeekLabel: recommendation.matchWeek.label,
    opponentName: recommendation.matchWeek.opponentName ?? "Opponent pending",
    formation: recommendation.formation.code as RecommendationRecord["formation"],
    status:
      recommendation.status === "FINAL"
        ? "READY"
        : recommendation.status === "FAILED"
          ? "FAILED"
          : "DRAFT",
    summary: recommendation.summary,
    ruleScoreSummary: recommendation.ruleScoreSummary,
    mlSupportSummary: recommendation.mlSupportSummary ?? undefined,
    lineup: selectedPlayers.map((playerEntry) => ({
      id: playerEntry.player.id,
      squadNumber: playerEntry.player.squadNumber,
      fullName: playerEntry.player.fullName,
      positionGroup: playerEntry.player.positionGroup,
      positionLabel: playerEntry.player.primaryPosition,
      startingPosition: playerEntry.startingPosition ?? playerEntry.player.primaryPosition,
      readinessScore: Number(playerEntry.computedScore.toFixed(0)),
      reason: playerEntry.selectionReason ?? "Selected for this recommendation run.",
    })),
    excludedPlayers: mapExcludedPlayer(recommendation),
    explanationHighlights: selectedPlayers
      .slice(0, 3)
      .map(
        (playerEntry) =>
          `${playerEntry.player.fullName} was retained because ${(
            playerEntry.selectionReason ?? "the player ranked strongly in the rule engine"
          ).replace(/^Selected based on\s*/i, "").replace(/\.$/, "")}.`,
      ),
  };
};
