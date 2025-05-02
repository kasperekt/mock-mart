import { db } from '@/db';
import { ratings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// Mock getUserIdFromSession (replace with real auth in production)
async function getUserIdFromSession(request: Request): Promise<number | null> {
  // TODO: Replace with real session logic
  return 1;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const productId = Number(params.id);
    const existing = await db.select().from(ratings).where(and(eq(ratings.productId, productId), eq(ratings.userId, userId)));
    if (existing.length === 0) {
      return NextResponse.json({ rating: null });
    }
    return NextResponse.json({ rating: existing[0].rating });
  } catch (error) {
    console.error('Error getting user rating:', error);
    return NextResponse.json(
      { error: 'Failed to get user rating' },
      { status: 500 }
    );
  }
} 