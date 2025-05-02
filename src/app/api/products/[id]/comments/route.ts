import { NextResponse } from 'next/server';
import { getCommentsByProductId, addComment } from '@/services/commentService';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = await Promise.resolve(params.id);
    const comments = await getCommentsByProductId(Number(productId));
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = await Promise.resolve(params.id);
    const { content } = await request.json();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    // You may want to implement a getUserIdFromSession helper using Drizzle ORM
    // For now, throw an error to indicate this needs to be implemented
    throw new Error('getUserIdFromSession not implemented with Drizzle ORM');
    // const userId = await getUserIdFromSession(sessionId);
    // if (!userId) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }
    // if (!content) {
    //   return NextResponse.json(
    //     { error: 'Comment content is required' },
    //     { status: 400 }
    //   );
    // }
    // const comment = await addComment(Number(productId), userId, content);
    // return NextResponse.json({ message: 'Comment posted successfully', comment });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    );
  }
} 