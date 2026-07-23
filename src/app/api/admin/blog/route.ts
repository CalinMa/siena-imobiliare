import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

function slugify(text: string) {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM blog_posts ORDER BY published_at DESC');
    return NextResponse.json(rows);
  } catch (err) {
    console.error('BLOG API DB ERROR:', err);
    return NextResponse.json({ error: 'Database error', details: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await request.json();
  const slug = slugify(data.title) + '-' + Math.floor(Math.random() * 10000);
  
  try {
    const [result] = await db.query(
      `INSERT INTO blog_posts (
        title, slug, summary, content, image_url, meta_title, meta_description, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, slug, data.summary || '', data.content || '', data.image_url || '',
        (data.meta_title || data.title).substring(0, 255), 
        (data.meta_description || data.summary || '').substring(0, 255), 
        data.published_at || new Date()
      ]
    );

    revalidatePath('/articole-utile', 'layout');
    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create blog post', details: String(err) }, { status: 500 });
  }
}
