import { Router } from "express";

import { env } from "../config/env.js";
import { APP_METADATA } from "../config/constants.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { formationRoutes } from "../modules/formations/formation.routes.js";
import { matchWeekRoutes } from "../modules/match-weeks/match-week.routes.js";
import { playerRoutes } from "../modules/players/player.routes.js";
import { recommendationRoutes } from "../modules/recommendations/recommendation.routes.js";
import { weeklyPerformanceRoutes } from "../modules/weekly-performance/weekly-performance.routes.js";

export const appRouter = Router();

appRouter.get("/health", (_request, response) => {
  response.json({
    service: "api",
    status: "ok",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

appRouter.get("/meta", (_request, response) => {
  response.json(APP_METADATA);
});

appRouter.use("/auth", authRoutes);
appRouter.use("/players", playerRoutes);
appRouter.use("/match-weeks", matchWeekRoutes);
appRouter.use("/weekly-performance", weeklyPerformanceRoutes);
appRouter.use("/formations", formationRoutes);
appRouter.use("/recommendations", recommendationRoutes);
