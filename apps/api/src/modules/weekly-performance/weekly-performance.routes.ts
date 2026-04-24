import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { authMiddleware } from "../../middleware/auth.js";
import { weeklyPerformanceController } from "./weekly-performance.controller.js";

export const weeklyPerformanceRoutes = Router();

weeklyPerformanceRoutes.use(authMiddleware);

weeklyPerformanceRoutes.get(
  "/match-week/:matchWeekId",
  asyncHandler(weeklyPerformanceController.listByMatchWeek),
);
weeklyPerformanceRoutes.post("/", asyncHandler(weeklyPerformanceController.create));
weeklyPerformanceRoutes.put("/:id", asyncHandler(weeklyPerformanceController.update));
