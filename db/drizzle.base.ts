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

// Environment type definition
type Environment = "development" | "staging" | "production";

// Get current environment
const getCurrentEnv = (): Environment => {
  const env = process.env.NODE_ENV?.toLowerCase() || "development";
  if (!["development", "staging", "production"].includes(env)) {
    throw new Error(`Invalid environment: ${env}`);
  }
  return env as Environment;
};

// Database URL configuration
const getDatabaseUrls = () => {
  const env = getCurrentEnv();

  // Get appropriate database URLs based on environment
  const dbUrl = process.env[`DATABASE_URL_${env.toUpperCase()}`];

  if (!dbUrl) {
    throw new Error(`DATABASE_URL_${env.toUpperCase()} is not set`);
  }

  return {
    dbUrl,
  };
};

// Database connections with logging based on environment
const createDatabaseConnections = () => {
  const env = getCurrentEnv();
  const urls = getDatabaseUrls();

  // Enable logging only in development
  const enableLogging = env === "development";

  // Create database connections
  const sql: NeonQueryFunction<boolean, boolean> = neon(urls.dbUrl);

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
