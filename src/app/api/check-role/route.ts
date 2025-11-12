import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/authentication';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user?.roles) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    const { allowedRoles } = await request.json();
    
    if (!allowedRoles || !Array.isArray(allowedRoles)) {
      return NextResponse.json({ hasAccess: false }, { status: 400 });
    }

    const userRoles = session.user.roles;
    const hasAccess = allowedRoles.some(role => userRoles.includes(role));

    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Role check error:', error);
    return NextResponse.json({ hasAccess: false }, { status: 500 });
  }
}