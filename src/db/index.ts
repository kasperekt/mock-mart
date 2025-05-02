import { drizzle } from "drizzle-orm/mysql2";

console.log('DB URL', process.env.DB_URL);

export const db = drizzle({
  connection: process.env.DB_URL as string,
  casing: "snake_case"
});