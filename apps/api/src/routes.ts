import { Router } from "express";

import { env } from "./config/env.js";

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
  response.json({
    name: "Club Performance and Formation Optimizer API",
    version: "0.1.0",
    phase: 4,
    scope: "local-environment-setup",
  });
});
