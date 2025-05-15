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

export async function editComment(commentId: number, userId: number, content: string): Promise<Comment | null> {
  // Update the comment only if it belongs to the user
  await db.update(comments)
    .set({ content })
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

  // Get the updated comment
  const rows = await db.select()
    .from(comments)
    .where(eq(comments.id, commentId));

  if (rows.length === 0) return null;

  const comment = rows[0];
  return {
    id: comment.id,
    productId: comment.productId,
    userId: comment.userId,
    content: comment.content,
    createdAt: comment.createdAt ? new Date(comment.createdAt) : null
  };
}

export async function deleteComment(commentId: number, userId: number): Promise<boolean> {
  // First check if the comment exists and belongs to the user
  const commentExists = await db.select({ id: comments.id })
    .from(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

  if (commentExists.length === 0) {
    return false;
  }

  // Delete the comment
  await db.delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

  return true;
}

export async function getCommentCountByProductId(productId: number): Promise<number> {
  const rows = await db.select().from(comments).where(eq(comments.productId, productId));
  return rows.length;
} 