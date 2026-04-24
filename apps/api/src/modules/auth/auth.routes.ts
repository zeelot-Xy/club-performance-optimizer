import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { authMiddleware } from "../../middleware/auth.js";
import { authController } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/login", asyncHandler(authController.login));
authRoutes.get("/me", authMiddleware, asyncHandler(authController.me));
