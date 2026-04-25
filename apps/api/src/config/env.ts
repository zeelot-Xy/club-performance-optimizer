import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  AI_SERVICE_URL: z.string().url(),
  AI_SERVICE_TIMEOUT_MS: z.coerce.number().default(5000),
  FRONTEND_URL: z.string().url(),
  FOOTBALL_DATA_API_BASE_URL: z.string().url().default("https://api.football-data.org/v4"),
  FOOTBALL_DATA_API_KEY: z.string().trim().optional(),
  THESPORTSDB_API_BASE_URL: z.string().url().default("https://www.thesportsdb.com/api/v1/json/3"),
});

export const env = envSchema.parse(process.env);
