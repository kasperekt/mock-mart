import { NextResponse } from 'next/server';
import { db } from '@/db';
import { ratings } from '@/db/schema';
import { getProduct } from '@/services/productService';
import { eq, and } from 'drizzle-orm';

// Mock getUserIdFromSession (replace with real auth in production)
async function getUserIdFromSession(request: Request): Promise<number | null> {
  // TODO: Replace with real session logic
  return 1;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const productId = Number(params.id);
    const { rating } = await request.json();
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }
    // Check if user already rated
    const existing = await db.select().from(ratings).where(and(eq(ratings.productId, productId), eq(ratings.userId, userId)));
    if (existing.length > 0) {
      return NextResponse.json({ error: 'You have already rated this product' }, { status: 400 });
    }
    // Insert rating
    await db.insert(ratings).values({ productId, userId, rating });
    // Get new rating info
    const product = await getProduct(productId);
    return NextResponse.json({ rating: product?.rating });
  } catch (error) {
    console.error('Error updating product rating:', error);
    return NextResponse.json(
      { error: 'Failed to update product rating' },
      { status: 500 }
    );
  }
} 