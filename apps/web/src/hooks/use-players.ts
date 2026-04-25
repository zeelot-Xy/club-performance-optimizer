import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../lib/api-client";
import { useClubs } from "./use-clubs";
import type { ApiPlayer, PlayerCreateInput } from "../types/ui";

export const usePlayers = () => {
  const queryClient = useQueryClient();
  const { currentClubQuery } = useClubs();
  const activeClubId = currentClubQuery.data?.id;

  const query = useQuery({
    queryKey: ["players", activeClubId ?? "no-club"],
    enabled: Boolean(activeClubId),
    queryFn: () => apiClient.get<ApiPlayer[]>("/players"),
  });

  const createPlayer = useMutation({
    mutationFn: (payload: PlayerCreateInput) => apiClient.post<ApiPlayer>("/players", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  const updatePlayer = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<PlayerCreateInput> }) =>
      apiClient.patch<ApiPlayer>(`/players/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["player", variables.id] });
    },
  });

  return {
    ...query,
    createPlayer,
    updatePlayer,
  };
};
