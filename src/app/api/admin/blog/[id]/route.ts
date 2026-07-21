import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { id } = await params;
  const data = await request.json();
  
  try {
    await db.query(
      `UPDATE blog_posts SET 
        title = ?, summary = ?, content = ?, image_url = ?, meta_title = ?, meta_description = ?, published_at = ?
       WHERE id = ?`,
      [
        data.title, data.summary || '', data.content || '', data.image_url || '',
        data.meta_title || data.title, data.meta_description || data.summary || '', data.published_at || new Date(),
        id
      ]
    );
      
    revalidatePath('/articole-utile', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update blog post', details: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  
  try {
    await db.query('DELETE FROM blog_posts WHERE id = ?', [id]);
    revalidatePath('/articole-utile', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
