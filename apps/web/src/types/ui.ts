export type PlayerStatus = "ACTIVE" | "INJURED" | "UNAVAILABLE" | "RECOVERY";
export type PositionGroup = "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD";
export type PreferredFoot = "LEFT" | "RIGHT" | "BOTH";
export type MatchWeekStatus = "PLANNING" | "READY" | "COMPLETED";
export type RecommendationStatus = "READY" | "INSUFFICIENT_PLAYERS";

export type PlayerRecord = {
  id: string;
  squadNumber: number;
  fullName: string;
  primaryPosition: string;
  secondaryPosition?: string;
  positionGroup: PositionGroup;
  preferredFoot: PreferredFoot;
  age: number;
  status: PlayerStatus;
  readiness: number;
};

export type MatchWeekRecord = {
  id: string;
  label: string;
  opponentName: string;
  matchDate: string;
  status: MatchWeekStatus;
  notes: string;
  completion: number;
};

export type LineupPlayer = {
  id: string;
  squadNumber: number;
  fullName: string;
  positionGroup: PositionGroup;
  positionLabel: string;
  startingPosition: string;
  readinessScore: number;
  reason: string;
};

export type ExcludedPlayer = {
  id: string;
  fullName: string;
  squadNumber: number;
  reason: string;
  status: PlayerStatus;
};

export type RecommendationRecord = {
  id: string;
  matchWeekLabel: string;
  opponentName: string;
  formation: "4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2";
  status: RecommendationStatus;
  summary: string;
  ruleScoreSummary: string;
  mlSupportSummary?: string;
  lineup: LineupPlayer[];
  excludedPlayers: ExcludedPlayer[];
  explanationHighlights: string[];
};

export type DashboardStat = {
  label: string;
  value: string;
  trend: string;
  tone?: "default" | "success" | "warning";
};
