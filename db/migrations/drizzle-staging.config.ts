import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env.local" });

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations/staging",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_STAGING!,
  },
} satisfies Config;
