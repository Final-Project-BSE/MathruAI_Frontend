import { NextResponse } from 'next/server';
import { getUserRole } from '@/lib/authentication';

export async function GET() {
  try {
    const role = await getUserRole();
    
    if (!role) {
      return NextResponse.json({ role: null }, { status: 401 });
    }

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Get role error:', error);
    return NextResponse.json({ role: null }, { status: 500 });
  }
}