import { pgTable, timestamp, text, char, pgEnum } from "drizzle-orm/pg-core";

export const loginProviderEnum = pgEnum("loginprovider", [
  "email",
  "google",
  "github",
]);
export const User = pgTable("User", {
  userId: char("userId", { length: 26 }).primaryKey().notNull(),
  subId: char("subId", { length: 36 }).notNull(),
  // We are not making this unique to support merging accounts in later
  // iterations
  email: text("email"),
  loginProvider: loginProviderEnum("loginProvider").array().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
});
