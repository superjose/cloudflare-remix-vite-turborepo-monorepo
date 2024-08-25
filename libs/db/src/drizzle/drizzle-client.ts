import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type DrizzleClient = PostgresJsDatabase<typeof schema>;

let drizzleClient: DrizzleClient | undefined;

type GetClientInput = {
  databaseUrl: string;
  env: string;
  mode?: "cloudflare" | "node";
};

declare var window: typeof globalThis;
declare var self: typeof globalThis;

export function getDrizzleClient(input: GetClientInput) {
  const { mode, env } = input;

  if (mode === "cloudflare") {
    return generateClient(input);
  }

  const globalObject =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof global !== "undefined"
        ? global
        : typeof window !== "undefined"
          ? window
          : self;

  if (env === "production") {
    drizzleClient = generateClient(input);
  } else if (globalObject) {
    if (!(globalObject as any).__db__) {
      (globalObject as any).__db__ = generateClient(input);
    }
    drizzleClient = (globalObject as any).__db__;
  } else {
    drizzleClient = generateClient(input);
  }

  return drizzleClient;
}
type GenerateClientInput = {
  databaseUrl: string;
  env: string;
};
function generateClient(input: GenerateClientInput) {
  const { databaseUrl, env } = input;
  const isLoggingEnabled = env === "development";

  console.log("Generaitng cliiiieeent");
  try {
    const client = postgres(databaseUrl, { prepare: false });
    const db = drizzle(client, { schema, logger: isLoggingEnabled });
    return db;
  } catch (e) {
    console.log("ERROR", e);
    return undefined!;
  }
}
