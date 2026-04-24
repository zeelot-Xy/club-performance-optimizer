import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { authMiddleware } from "../../middleware/auth.js";
import { playerController } from "./player.controller.js";

export const playerRoutes = Router();

playerRoutes.use(authMiddleware);

playerRoutes.get("/", asyncHandler(playerController.list));
playerRoutes.get("/:id", asyncHandler(playerController.getById));
playerRoutes.post("/", asyncHandler(playerController.create));
playerRoutes.patch("/:id", asyncHandler(playerController.update));
