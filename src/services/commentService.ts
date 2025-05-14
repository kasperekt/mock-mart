import { db } from "../db";
import { comments } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

export interface Comment {
  id: number;
  productId: number;
  userId: number;
  content: string;
  createdAt: Date | null;
}

export async function getCommentsByProductId(productId: number): Promise<Comment[]> {
  const rows = await db.select().from(comments)
    .where(eq(comments.productId, productId))
    .orderBy(desc(comments.createdAt)); // Sort by newest first
  return rows.map(row => ({
    id: row.id,
    productId: row.productId,
    userId: row.userId,
    content: row.content,
    createdAt: row.createdAt ? new Date(row.createdAt) : null
  }));
}

export async function addComment(productId: number, userId: number, content: string): Promise<Comment> {
  // Insert the comment directly without checking for existing comments
  await db.insert(comments).values({ productId, userId, content });

  // Get the newly added comment (should be the most recent one from this user on this product)
  const [comment] = await db.select()
    .from(comments)
    .where(and(eq(comments.productId, productId), eq(comments.userId, userId)))
    .orderBy(desc(comments.createdAt))
    .limit(1);

  return {
    id: comment.id,
    productId: comment.productId,
    userId: comment.userId,
    content: comment.content,
    createdAt: comment.createdAt ? new Date(comment.createdAt) : null
  };
}

export async function getCommentCountByProductId(productId: number): Promise<number> {
  const rows = await db.select().from(comments).where(eq(comments.productId, productId));
  return rows.length;
} 