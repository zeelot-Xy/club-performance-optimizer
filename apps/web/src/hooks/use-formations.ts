import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../lib/api-client";
import type { ApiFormation } from "../types/ui";

export const useFormations = () =>
  useQuery({
    queryKey: ["formations"],
    queryFn: () => apiClient.get<ApiFormation[]>("/formations"),
  });
