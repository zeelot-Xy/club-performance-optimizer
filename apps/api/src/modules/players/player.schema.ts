import { PlayerStatus, PositionGroup, PreferredFoot } from "@prisma/client";
import { z } from "zod";

export const createPlayerSchema = z.object({
  fullName: z.string().trim().min(1),
  squadNumber: z.number().int().positive(),
  primaryPosition: z.string().trim().min(1),
  secondaryPosition: z.string().trim().min(1).optional().nullable(),
  positionGroup: z.nativeEnum(PositionGroup),
  preferredFoot: z.nativeEnum(PreferredFoot).default(PreferredFoot.UNKNOWN),
  age: z.number().int().positive(),
  heightCm: z.number().int().positive().optional().nullable(),
  status: z.nativeEnum(PlayerStatus).default(PlayerStatus.ACTIVE),
});

export const updatePlayerSchema = createPlayerSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one player field must be provided." },
);

export const playerDetailsQuerySchema = z.object({
  matchWeekId: z.string().trim().min(1).optional(),
});
