import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../lib/api-client";
import { useClubs } from "./use-clubs";
import type { ApiMatchWeek, MatchWeekCreateInput } from "../types/ui";

export const useMatchWeeks = () => {
  const queryClient = useQueryClient();
  const { currentClubQuery } = useClubs();
  const activeClubId = currentClubQuery.data?.id;

  const query = useQuery({
    queryKey: ["match-weeks", activeClubId ?? "no-club"],
    enabled: Boolean(activeClubId),
    queryFn: () => apiClient.get<ApiMatchWeek[]>("/match-weeks"),
  });

  const createMatchWeek = useMutation({
    mutationFn: (payload: MatchWeekCreateInput) => apiClient.post<ApiMatchWeek>("/match-weeks", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-weeks"] });
    },
  });

  const updateMatchWeek = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<MatchWeekCreateInput> }) =>
      apiClient.patch<ApiMatchWeek>(`/match-weeks/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["match-weeks"] });
      queryClient.invalidateQueries({ queryKey: ["match-week", variables.id] });
    },
  });

  return {
    ...query,
    createMatchWeek,
    updateMatchWeek,
  };
};
