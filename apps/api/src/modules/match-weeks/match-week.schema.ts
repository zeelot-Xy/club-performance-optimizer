import { MatchWeekStatus } from "@prisma/client";
import { z } from "zod";

export const createMatchWeekSchema = z.object({
  label: z.string().trim().min(1),
  opponentName: z.string().trim().min(1).optional().nullable(),
  matchDate: z.coerce.date(),
  status: z.nativeEnum(MatchWeekStatus).default(MatchWeekStatus.DRAFT),
  notes: z.string().trim().optional().nullable(),
});

export const updateMatchWeekSchema = createMatchWeekSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one match week field must be provided." },
);
