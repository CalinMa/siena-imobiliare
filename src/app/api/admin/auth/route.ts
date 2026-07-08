import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password === (process.env.ADMIN_PASSWORD || 'siena2026')) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'authenticated', { httpOnly: true, path: '/' });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 401 });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return NextResponse.json({ authenticated: token?.value === 'authenticated' });
}
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return NextResponse.json({ success: true });
}
