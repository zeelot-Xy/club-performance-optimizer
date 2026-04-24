import {
  AvailabilityStatus,
  InjuryStatus,
  SuspensionStatus,
} from "@prisma/client";
import { z } from "zod";

export const createWeeklyPerformanceSchema = z.object({
  matchWeekId: z.string().trim().min(1),
  playerId: z.string().trim().min(1),
  trainingRating: z.number().int().min(1).max(10),
  fitness: z.number().int().min(0).max(100),
  fatigue: z.number().int().min(0).max(100),
  morale: z.number().int().min(0).max(100),
  availability: z.nativeEnum(AvailabilityStatus),
  injuryStatus: z.nativeEnum(InjuryStatus),
  suspensionStatus: z.nativeEnum(SuspensionStatus),
  coachNotes: z.string().trim().optional().nullable(),
});

export const updateWeeklyPerformanceSchema = createWeeklyPerformanceSchema
  .omit({ matchWeekId: true, playerId: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one weekly performance field must be provided.",
  });
