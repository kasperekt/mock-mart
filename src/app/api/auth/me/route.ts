import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/services/authService';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in me route:', error);
    
    return NextResponse.json(
      { error: 'Failed to get current user' },
      { status: 500 }
    );
  }
} 