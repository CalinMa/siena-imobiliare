import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { getJwtSecret, isAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();
  
  // Check if there is an admin_password_hash in the database
  const [rows]: any = await db.query('SELECT setting_value FROM settings WHERE setting_key = "admin_password_hash"');
  let isValid = false;

  if (rows && rows.length > 0) {
    // We have a stored hash, verify against it
    isValid = await bcrypt.compare(password, rows[0].setting_value);
  } else {
    // Fallback to default password if not set
    isValid = password === (process.env.ADMIN_PASSWORD || 'siena2026');
  }

  if (isValid) {
    const secret = await getJwtSecret();
    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // 7 days session
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, { 
      httpOnly: true, 
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    });
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ success: false }, { status: 401 });
}

export async function GET() {
  const authenticated = await isAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return NextResponse.json({ success: true });
}
