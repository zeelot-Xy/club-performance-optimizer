import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { authMiddleware } from "../../middleware/auth.js";
import { formationController } from "./formation.controller.js";

export const formationRoutes = Router();

formationRoutes.use(authMiddleware);

formationRoutes.get("/", asyncHandler(formationController.list));
formationRoutes.get("/:id", asyncHandler(formationController.getById));
