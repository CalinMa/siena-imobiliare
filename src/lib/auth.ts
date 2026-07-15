import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import db from '@/lib/db';
import crypto from 'crypto';

// We need a helper to get or create the JWT secret from the DB
export async function getJwtSecret(): Promise<Uint8Array> {
  const [rows]: any = await db.query('SELECT setting_value FROM settings WHERE setting_key = "jwt_secret"');
  let secretString = '';
  
  if (rows && rows.length > 0) {
    secretString = rows[0].setting_value;
  } else {
    // Generate a random secret
    secretString = crypto.randomBytes(32).toString('hex');
    await db.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
      ['jwt_secret', secretString]
    );
  }
  
  return new TextEncoder().encode(secretString);
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) return false;
    
    // In transition period, we might still have 'authenticated' literal token in browser cookies.
    // If it is 'authenticated', we return false so it forces them to log in again via JWT.
    if (token === 'authenticated') return false;

    const secret = await getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    
    return payload.admin === true;
  } catch (error) {
    // Token is invalid, expired, etc.
    return false;
  }
}
