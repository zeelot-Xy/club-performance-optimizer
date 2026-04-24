import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { authMiddleware } from "../../middleware/auth.js";
import { recommendationController } from "./recommendation.controller.js";

export const recommendationRoutes = Router();

recommendationRoutes.use(authMiddleware);

recommendationRoutes.get("/", asyncHandler(recommendationController.list));
recommendationRoutes.post("/generate", asyncHandler(recommendationController.generate));
recommendationRoutes.get(
  "/match-week/:matchWeekId",
  asyncHandler(recommendationController.getByMatchWeek),
);
recommendationRoutes.get("/:id", asyncHandler(recommendationController.getById));
