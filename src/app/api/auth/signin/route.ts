import { NextResponse } from 'next/server';
import { signIn } from '@/services/authService';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Sign in the user
    const { user, sessionId } = await signIn({ email, password });
    
    if (!user || !sessionId) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Manually set the session_id cookie using Set-Cookie header
    const cookieValue = `session_id=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
    return NextResponse.json(
      { user },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookieValue,
        },
      }
    );
  } catch (error) {
    console.error('Sign in error:', error);
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
} 