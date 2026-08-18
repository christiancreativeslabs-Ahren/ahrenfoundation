import { type NeonQueryFunction, neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
// biome-ignore lint/performance/noNamespaceImport: drizzle-orm requires all schemas bundled as object
import * as schema from "./schema";

// Load environment variables based on NODE_ENV
const loadEnvConfig = () => {
  const env = process.env.NODE_ENV || "development";

  // Try loading environment-specific file first
  dotenv.config({ path: `.env.${env}.local` });
  dotenv.config({ path: `.env.${env}` });

  // Load default .env files as fallback
  dotenv.config({ path: ".env.local" });
  dotenv.config({ path: ".env" });
};

// Load environment configuration
loadEnvConfig();

type Environment = "development" | "preview" | "staging" | "production";

function getCurrentEnv(): Environment {
  const env =
    process.env.VERCEL_ENV?.toLowerCase() ??
    process.env.NODE_ENV?.toLowerCase() ??
    "development";

  if (!["development", "preview", "staging", "production"].includes(env)) {
    throw new Error(`Invalid environment: ${env}`);
  }

  return env as Environment;
}

function getDatabaseUrl(env: Environment) {
  const directUrl = process.env.DATABASE_URL?.trim();
  if (directUrl) return directUrl;

  const envUrl = process.env[`DATABASE_URL_${env.toUpperCase()}`]?.trim();
  if (envUrl) return envUrl;

  if (env === "preview") {
    const previewUrl = process.env.DATABASE_URL_PREVIEW?.trim();
    if (previewUrl) return previewUrl;
  }

  throw new Error(
    `No database URL configured. Set DATABASE_URL or DATABASE_URL_${env.toUpperCase()}.`
  );
}

// Database connections with logging based on environment
const createDatabaseConnections = () => {
  const env = getCurrentEnv();
  const dbUrl = getDatabaseUrl(env);

  // Enable logging only in development
  const enableLogging = env === "development";

  // Create database connections
  const sql: NeonQueryFunction<boolean, boolean> = neon(dbUrl);

  const database = drizzle(sql, {
    schema,
    logger: enableLogging,
  });

  return { db: database };
};

// Export database instances
const { db } = createDatabaseConnections();

export type DB = typeof db;

export { db };

export default db;
