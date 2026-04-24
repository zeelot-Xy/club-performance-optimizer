import { z } from "zod";

export const generateRecommendationSchema = z.object({
  matchWeekId: z.string().trim().min(1),
});
