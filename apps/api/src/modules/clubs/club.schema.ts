import { z } from "zod";

export const clubSearchQuerySchema = z.object({
  q: z.string().trim().min(2, "Enter at least two characters to search for a club."),
});

export const importClubSchema = z.object({
  provider: z.enum(["football-data", "thesportsdb"]).default("thesportsdb"),
  externalClubId: z.string().trim().min(1),
});

