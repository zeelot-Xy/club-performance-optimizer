import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError, apiClient } from "../lib/api-client";
import { useClubs } from "./use-clubs";
import type { ApiRecommendation } from "../types/ui";

export const useRecommendations = (matchWeekId?: string) => {
  const queryClient = useQueryClient();
  const { currentClubQuery } = useClubs();
  const activeClubId = currentClubQuery.data?.id;

  const listQuery = useQuery({
    queryKey: ["recommendations", activeClubId ?? "no-club"],
    enabled: Boolean(activeClubId),
    queryFn: () => apiClient.get<ApiRecommendation[]>("/recommendations"),
  });

  const byMatchWeekQuery = useQuery({
    queryKey: ["recommendations", activeClubId ?? "no-club", "match-week", matchWeekId],
    enabled: Boolean(activeClubId && matchWeekId),
    queryFn: async () => {
      try {
        const response = await apiClient.get<ApiRecommendation[]>(
          `/recommendations/match-week/${matchWeekId}`,
        );

        return response[0] ?? null;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }

        throw error;
      }
    },
  });

  const generateRecommendation = useMutation({
    mutationFn: (selectedMatchWeekId: string) =>
      apiClient.post<ApiRecommendation>("/recommendations/generate", {
        matchWeekId: selectedMatchWeekId,
      }),
    onSuccess: (_, selectedMatchWeekId) => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({
        queryKey: ["recommendations", activeClubId ?? "no-club", "match-week", selectedMatchWeekId],
      });
    },
  });

  return {
    listQuery,
    byMatchWeekQuery,
    generateRecommendation,
  };
};
