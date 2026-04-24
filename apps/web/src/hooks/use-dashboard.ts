import { useMemo } from "react";

import { mapApiMatchWeekToRecord, mapApiPlayerToRecord } from "../lib/formatters";
import { useMatchWeeks } from "./use-match-weeks";
import { usePlayers } from "./use-players";
import { useRecommendations } from "./use-recommendations";

export const useDashboard = () => {
  const playersQuery = usePlayers();
  const matchWeeksQuery = useMatchWeeks();
  const { listQuery: recommendationsQuery } = useRecommendations();

  const derived = useMemo(() => {
    const players = (playersQuery.data ?? []).map(mapApiPlayerToRecord);
    const matchWeeks = (matchWeeksQuery.data ?? []).map(mapApiMatchWeekToRecord);
    const recommendations = recommendationsQuery.data ?? [];

    const activeMatchWeek =
      matchWeeks.find((week) => week.status === "READY") ??
      matchWeeks.find((week) => week.status === "DRAFT") ??
      matchWeeks[0];

    const latestRecommendation = recommendations[0];
    const activePlayers = players.filter((player) => player.status === "ACTIVE");
    const injuredPlayers = players.filter((player) => player.status === "INJURED");

    const dashboardStats = [
      {
        label: "Squad Size",
        value: `${players.length}`,
        trend: `${activePlayers.length} players currently marked active`,
      },
      {
        label: "Eligible Starters",
        value: `${Math.min(activePlayers.length, 11)}`,
        trend: activePlayers.length >= 11 ? "Enough active players for a full XI" : "Selection depth is below full-match requirement",
        tone: activePlayers.length >= 11 ? "success" : "warning",
      },
      {
        label: "Injury / Recovery",
        value: `${injuredPlayers.length}`,
        trend: injuredPlayers.length ? "Monitor return timelines before next generation run" : "No current injury flags in player registry",
        tone: injuredPlayers.length ? "warning" : "success",
      },
      {
        label: "Recommendation Confidence",
        value:
          latestRecommendation && latestRecommendation.recommendationPlayers.length
            ? `${Math.round(
                latestRecommendation.recommendationPlayers
                  .filter((entry) => entry.isSelected)
                  .reduce((sum, entry) => sum + entry.computedScore, 0) / 11,
              )}%`
            : "N/A",
        trend: latestRecommendation
          ? `Latest stored recommendation uses ${latestRecommendation.formation.code}`
          : "No stored recommendation yet",
      },
    ] as const;

    const unitLabels = {
      GOALKEEPER: "Goalkeepers",
      DEFENDER: "Defenders",
      MIDFIELDER: "Midfielders",
      FORWARD: "Forwards",
    } as const;

    const readinessByUnit = (["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"] as const).map((unit) => {
      const unitPlayers = players.filter((player) => player.positionGroup === unit);
      const activeCount = unitPlayers.filter((player) => player.status === "ACTIVE").length;
      const readiness =
        unitPlayers.length > 0 ? Math.round((activeCount / unitPlayers.length) * 100) : 0;

      return {
        unit: unitLabels[unit],
        readiness,
      };
    });

    const weeklyTrend = matchWeeks
      .slice()
      .reverse()
      .slice(0, 4)
      .map((week) => ({
        week: week.label.replace("Week ", "W"),
        readiness: week.status === "COMPLETED" ? 100 : week.status === "READY" ? 84 : 52,
      }));

    return {
      players,
      matchWeeks,
      activeMatchWeek,
      latestRecommendation,
      dashboardStats,
      readinessByUnit,
      weeklyTrend,
    };
  }, [playersQuery.data, matchWeeksQuery.data, recommendationsQuery.data]);

  return {
    isLoading:
      playersQuery.isLoading || matchWeeksQuery.isLoading || recommendationsQuery.isLoading,
    isError: playersQuery.isError || matchWeeksQuery.isError || recommendationsQuery.isError,
    error:
      playersQuery.error ?? matchWeeksQuery.error ?? recommendationsQuery.error ?? null,
    ...derived,
  };
};
