import { NextResponse } from 'next/server';
import { getSession } from '@/lib/authentication';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Return session data (without sensitive cookie info)
    return NextResponse.json({
      user: {
        email: session.user.email,
        token: session.user.token,
        roles: session.user.roles,
      },
    });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}