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
  
  const tags = JSON.stringify(data.tags || []);
  
  try {
    const [result] = await db.query(
      `INSERT INTO properties (
        title, slug, description, price, status, images,
        transaction_type, property_type, city, zone,
        surface_useable, surface_total, surface_land,
        rooms, bedrooms, bathrooms, floor, building_floors, building_construction_year,
        partitioning, comfort, tags, video_link, virtual_tour_link
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, slug, data.description || '', data.price || 0, data.status || 'activ', images,
        data.transaction_type || 'vanzare', data.property_type || 'apartament', data.city || '', data.zone || '',
        data.surface_useable || null, data.surface_total || null, data.surface_land || null,
        data.rooms || null, data.bedrooms || null, data.bathrooms || null, data.floor || '', data.building_floors || null, data.building_construction_year || null,
        data.partitioning || '', data.comfort || '', tags, data.video_link || '', data.virtual_tour_link || ''
      ]
    );
    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
