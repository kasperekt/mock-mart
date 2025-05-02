import { NextResponse } from 'next/server';
import { signUp } from '@/services/authService';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate input
    if (!data.email || !data.password || !data.name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password strength
    if (data.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // Create the user
    const user = await signUp(data);
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in signup route:', error);
    
    if (error instanceof Error) {
      if (error.message === 'User with this email already exists') {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 