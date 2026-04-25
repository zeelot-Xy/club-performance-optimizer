import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../lib/api-client";
import { useClubs } from "./use-clubs";
import type { ApiPlayerDetails } from "../types/ui";

export const usePlayerDetails = (playerId?: string | null, matchWeekId?: string | null) => {
  const { currentClubQuery } = useClubs();
  const activeClubId = currentClubQuery.data?.id;

  return useQuery({
    queryKey: ["player-details", activeClubId ?? "no-club", playerId, matchWeekId ?? null],
    enabled: Boolean(playerId && activeClubId),
    queryFn: () => {
      const params = new URLSearchParams();

      if (matchWeekId) {
        params.set("matchWeekId", matchWeekId);
      }

      const query = params.toString();
      return apiClient.get<ApiPlayerDetails>(
        `/players/${playerId}/details${query ? `?${query}` : ""}`,
      );
    },
  });
};
