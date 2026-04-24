import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { authMiddleware } from "../../middleware/auth.js";
import { matchWeekController } from "./match-week.controller.js";

export const matchWeekRoutes = Router();

matchWeekRoutes.use(authMiddleware);

matchWeekRoutes.get("/", asyncHandler(matchWeekController.list));
matchWeekRoutes.get("/:id", asyncHandler(matchWeekController.getById));
matchWeekRoutes.post("/", asyncHandler(matchWeekController.create));
matchWeekRoutes.patch("/:id", asyncHandler(matchWeekController.update));
