import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type PublicUser = Omit<User, "password">;

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp(data: SignUpData): Promise<User> {
  // Check if user already exists
  const existingUsers = await db.select().from(users).where(eq(users.email, data.email));
  if (existingUsers.length > 0) {
    throw new Error('User with this email already exists');
  }
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);
  await db.insert(users).values({
    email: data.email,
    password: passwordHash,
    name: data.name,
  });
  const [user] = await db.select().from(users).where(eq(users.email, data.email));
  return user;
}

export async function signIn(data: SignInData): Promise<{ user: PublicUser; sessionId: string }> {
  // Find the user
  const usersFound = await db.select().from(users).where(eq(users.email, data.email));
  if (usersFound.length === 0) {
    throw new Error('Invalid email or password');
  }
  const user = usersFound[0];
  // Verify password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  // Create a session
  const sessionId = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days
  await db.insert(sessions).values({ id: sessionId, userId: user.id, expiresAt });
  // Return user data without password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    sessionId
  };
}

export async function signOut(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  // Dynamically import cookies to ensure proper server context
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;
  if (!sessionId) {
    return null;
  }
  const result = await db.select().from(users)
    .innerJoin(sessions, eq(users.id, sessions.userId))
    .where(eq(sessions.id, sessionId));
  const user = result[0]?.users;
  const session = result[0]?.sessions;
  if (!user || !session) return null;
  if (session.expiresAt && session.expiresAt < new Date()) return null;
  // Exclude password from returned user
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
} 