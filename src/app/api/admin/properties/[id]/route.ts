import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_token')?.value === 'authenticated';
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // In Next.js App Router, params is a Promise in the latest versions, let's await it
  const { id } = await params;
  const data = await request.json();
  const images = JSON.stringify(data.images || []);
  
  try {
    await db.query(
      'UPDATE properties SET title = ?, description = ?, price = ?, status = ?, images = ? WHERE id = ?',
      [data.title, data.description || '', data.price || 0, data.status, images, id]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  
  try {
    await db.query('DELETE FROM properties WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
