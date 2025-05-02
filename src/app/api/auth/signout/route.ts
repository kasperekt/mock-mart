import { signOut as customSignOut } from '@/services/authService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const cookiesList = request.cookies;
  const sessionId = cookiesList.get('session_id')?.value;

  if (sessionId) {
  // Delete the session from the database
    await customSignOut(sessionId);
  }

  const response = NextResponse.json({});
  response.cookies.delete('session_id');

  return response;
} 