import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

export const signAccessToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "8h",
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
