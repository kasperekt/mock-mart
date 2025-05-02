import { drizzle } from "drizzle-orm/mysql2";

export const db = drizzle({
  connection: process.env.DATABASE_URL as string,
  casing: "snake_case"
});