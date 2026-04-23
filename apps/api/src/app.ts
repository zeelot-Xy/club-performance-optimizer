import express from "express";
import helmet from "helmet";

import { appRouter } from "./routes.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.json({
      message: "Club Performance API is running.",
    });
  });

  app.use("/api/v1", appRouter);

  return app;
};
