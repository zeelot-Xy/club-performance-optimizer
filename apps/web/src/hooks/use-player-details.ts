import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../lib/api-client";
import type { ApiPlayerDetails } from "../types/ui";

export const usePlayerDetails = (playerId?: string | null, matchWeekId?: string | null) =>
  useQuery({
    queryKey: ["player-details", playerId, matchWeekId ?? null],
    enabled: Boolean(playerId),
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
