import dotenv from "dotenv";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "..";
import devConfig from "./drizzle-dev.config";
import prodConfig from "./drizzle-prod.config";
import stagingConfig from "./drizzle-staging.config";

dotenv.config();

// Get environment from command line argument or default to 'dev'
// "db:drizzle:dev:migrate": "node -r esbuild-register ./migrate.ts dev",
// "db:drizzle:staging:migrate": "node -r esbuild-register ./migrate.ts staging",
// "db:drizzle:prod:migrate": "node -r esbuild-register ./migrate.ts prod",

const env = process.argv[2] || "dev";
const getConfig = () => {
  switch (env) {
    case "prod":
      return prodConfig;
    case "staging":
      return stagingConfig;
    default:
      return devConfig;
  }
};
const config = getConfig();

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: config.out! });
    console.log(`Migrations complete for ${env} environment`);
  } catch (error) {
    console.error(`Error during migration for ${env}: `, error);
    process.exit(1);
  }
};

main();

// process.argv is an array that contains the command-line arguments passed when starting the Node.js process:
// process.argv[0] is the path to the Node.js executable
// process.argv[1] is the path to the JavaScript file being executed
// process.argv[2] onwards are the actual arguments you pass to your script

// node -r esbuild-register ./migrate.ts dev
// node -r esbuild-register ./migrate.ts dev 0001_migration

// [
//   '/path/to/node',              // process.argv[0]
//   '/path/to/migrate.ts', // process.argv[1]
//   'dev',                        // process.argv[2]
//   '0001_migration'              // process.argv[3]
// ]
