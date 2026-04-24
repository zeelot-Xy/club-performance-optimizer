import type {
  DashboardStat,
  MatchWeekRecord,
  PlayerRecord,
  RecommendationRecord,
} from "../types/ui";

// Phase 10 keeps this file only as a lightweight fallback reference.
// Live pages now read from the backend through TanStack Query hooks.
export const dashboardStats: DashboardStat[] = [];
export const readinessByUnit: Array<{ unit: string; readiness: number }> = [];
export const weeklyTrend: Array<{ week: string; readiness: number }> = [];
export const players: PlayerRecord[] = [];
export const matchWeeks: MatchWeekRecord[] = [];
export const recommendation: RecommendationRecord | null = null;
