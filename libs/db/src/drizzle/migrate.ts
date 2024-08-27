import { config } from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
config({ path: "../../.dev.vars" });

const ssl = process.env.ENVIRONMENT === "development" ? undefined : "require";

const databaseUrl = drizzle(
  postgres(`${process.env.DATABASE_URL}`, { ssl, max: 1 })
);

const main = async () => {
  try {
    await migrate(databaseUrl, {
      migrationsFolder: "./src/generated",
    });
    console.log("Migration complete");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};

main();
