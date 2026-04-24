import cors from "cors";
import express from "express";
import helmet from "helmet";

import { API_PREFIX } from "./config/constants.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { appRouter } from "./routes/index.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.json({
      message: "Club Performance API is running.",
    });
  });

  app.use(API_PREFIX, appRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
