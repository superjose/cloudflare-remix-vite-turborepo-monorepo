import { config } from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import "dotenv/config";
import path from "path";
config({ path: "../../../../apps/my-remix-cloudflare-app/.dev.vars" });

const ssl = process.env.ENVIRONMENT === "development" ? undefined : "require";

const databaseUrl = drizzle(
  postgres(`${process.env.DATABASE_URL}`, { ssl, max: 1 })
);

// Somehow the current starting path is /libs/db
// Remember to have the DB running before running this script
const migration = path.resolve("./src/generated");

const main = async () => {
  try {
    await migrate(databaseUrl, {
      migrationsFolder: migration,
    });
    console.log("Migration complete");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};

main();
