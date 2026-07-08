import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_token')?.value === 'authenticated';
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const [rows] = await db.query('SELECT * FROM properties ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
  const images = JSON.stringify(data.images || []);
  
  try {
    const [result] = await db.query(
      'INSERT INTO properties (title, slug, description, price, status, images) VALUES (?, ?, ?, ?, ?, ?)',
      [data.title, slug, data.description || '', data.price || 0, data.status || 'activ', images]
    );
    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
