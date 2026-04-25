import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../lib/api-client";
import type { ApiClub, ApiClubImportResult, ApiClubSearchResult } from "../types/ui";

const invalidateClubWorkspace = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["clubs"] }),
    queryClient.invalidateQueries({ queryKey: ["clubs", "current"] }),
    queryClient.invalidateQueries({ queryKey: ["players"] }),
    queryClient.invalidateQueries({ queryKey: ["match-weeks"] }),
    queryClient.invalidateQueries({ queryKey: ["recommendations"] }),
    queryClient.invalidateQueries({ queryKey: ["player-details"] }),
    queryClient.invalidateQueries({ queryKey: ["weekly-performance"] }),
    queryClient.invalidateQueries({ queryKey: ["auth"] }),
  ]);
};

export const useClubs = (searchTerm?: string) => {
  const queryClient = useQueryClient();

  const currentClubQuery = useQuery({
    queryKey: ["clubs", "current"],
    queryFn: () => apiClient.get<ApiClub | null>("/clubs/current"),
  });

  const clubsQuery = useQuery({
    queryKey: ["clubs"],
    queryFn: () => apiClient.get<ApiClub[]>("/clubs"),
  });

  const searchQuery = useQuery({
    queryKey: ["clubs", "search", searchTerm],
    enabled: Boolean(searchTerm?.trim() && searchTerm.trim().length >= 2),
    queryFn: () =>
      apiClient.get<ApiClubSearchResult[]>(
        `/clubs/search?q=${encodeURIComponent(searchTerm?.trim() ?? "")}`,
      ),
  });

  const importClub = useMutation({
    mutationFn: (payload: { provider: "football-data" | "thesportsdb"; externalClubId: string }) =>
      apiClient.post<ApiClubImportResult>("/clubs/import", payload),
    onSuccess: async () => {
      await invalidateClubWorkspace(queryClient);
    },
  });

  const activateClub = useMutation({
    mutationFn: (clubId: string) => apiClient.post<ApiClub>(`/clubs/${clubId}/activate`),
    onSuccess: async () => {
      await invalidateClubWorkspace(queryClient);
    },
  });

  return {
    currentClubQuery,
    clubsQuery,
    searchQuery,
    importClub,
    activateClub,
  };
};
