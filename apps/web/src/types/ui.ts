export type UserRole = "COACH_ADMIN";
export type PlayerStatus = "ACTIVE" | "INACTIVE" | "INJURED";
export type PositionGroup = "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD";
export type PreferredFoot = "LEFT" | "RIGHT" | "BOTH" | "UNKNOWN";
export type MatchWeekStatus = "DRAFT" | "READY" | "COMPLETED";
export type RecommendationStatus = "DRAFT" | "FINAL" | "FAILED";
export type AvailabilityStatus = "AVAILABLE" | "UNAVAILABLE";
export type InjuryStatus = "FIT" | "MINOR_KNOCK" | "INJURED";
export type SuspensionStatus = "ELIGIBLE" | "SUSPENDED";
export type RecommendationPlayerRole =
  | "GOALKEEPER"
  | "DEFENDER"
  | "MIDFIELDER"
  | "FORWARD"
  | "BENCH"
  | "EXCLUDED";

export type ApiAuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  lastLoginAt?: string | null;
};

export type ApiLoginResponse = {
  accessToken: string;
  user: ApiAuthUser;
};

export type ApiPlayer = {
  id: string;
  fullName: string;
  squadNumber: number;
  primaryPosition: string;
  secondaryPosition?: string | null;
  positionGroup: PositionGroup;
  preferredFoot: PreferredFoot;
  age: number;
  heightCm?: number | null;
  status: PlayerStatus;
  createdAt: string;
  updatedAt: string;
};

export type ApiMatchWeek = {
  id: string;
  label: string;
  opponentName?: string | null;
  matchDate: string;
  status: MatchWeekStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: Pick<ApiAuthUser, "id" | "fullName" | "email">;
};

export type ApiFormation = {
  id: string;
  code: "4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2" | string;
  label: string;
  defenders: number;
  midfielders: number;
  forwards: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiRecommendationPlayer = {
  id: string;
  recommendationId: string;
  playerId: string;
  role: RecommendationPlayerRole;
  startingPosition?: string | null;
  isSelected: boolean;
  computedScore: number;
  selectionReason?: string | null;
  exclusionReason?: string | null;
  rankOrder?: number | null;
  createdAt: string;
  player: ApiPlayer;
};

export type ApiRecommendation = {
  id: string;
  matchWeekId: string;
  formationId: string;
  generatedById: string;
  status: RecommendationStatus;
  summary: string;
  ruleScoreSummary: string;
  mlSupportSummary?: string | null;
  createdAt: string;
  updatedAt: string;
  formation: ApiFormation;
  matchWeek: ApiMatchWeek;
  generatedBy: Pick<ApiAuthUser, "id" | "fullName" | "email">;
  recommendationPlayers: ApiRecommendationPlayer[];
};

export type PlayerCreateInput = {
  fullName: string;
  squadNumber: number;
  primaryPosition: string;
  secondaryPosition?: string | null;
  positionGroup: PositionGroup;
  preferredFoot: PreferredFoot;
  age: number;
  heightCm?: number | null;
  status: PlayerStatus;
};

export type MatchWeekCreateInput = {
  label: string;
  opponentName?: string | null;
  matchDate: string;
  status: MatchWeekStatus;
  notes?: string | null;
};

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
  status: "READY" | "DRAFT" | "FAILED";
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
