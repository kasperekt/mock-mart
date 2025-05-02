import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  password: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  await db.insert(users).values({ email, name, password });
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
} 