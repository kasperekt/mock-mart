import { NextResponse } from 'next/server';
import { signOut } from '@/services/authService';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    
    if (sessionId) {
      // Delete the session from the database
      await signOut(sessionId);
    }
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('session_id', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
} 