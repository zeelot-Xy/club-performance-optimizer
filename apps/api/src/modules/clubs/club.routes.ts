import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { authMiddleware } from "../../middleware/auth.js";
import { clubController } from "./club.controller.js";

export const clubRoutes = Router();

clubRoutes.use(authMiddleware);

clubRoutes.get("/", asyncHandler(clubController.list));
clubRoutes.get("/current", asyncHandler(clubController.getCurrent));
clubRoutes.get("/search", asyncHandler(clubController.search));
clubRoutes.post("/import", asyncHandler(clubController.import));
clubRoutes.post("/:id/activate", asyncHandler(clubController.activate));

