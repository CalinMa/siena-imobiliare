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
  
  const tags = JSON.stringify(data.tags || []);
  
  try {
    await db.query(
      `UPDATE properties SET 
        title = ?, description = ?, price = ?, status = ?, images = ?,
        transaction_type = ?, property_type = ?, city = ?, zone = ?,
        surface_useable = ?, surface_total = ?, surface_land = ?,
        rooms = ?, bedrooms = ?, bathrooms = ?, floor = ?, building_floors = ?, building_construction_year = ?,
        partitioning = ?, comfort = ?, tags = ?, video_link = ?, virtual_tour_link = ?
       WHERE id = ?`,
      [
        data.title, data.description || '', data.price || 0, data.status, images,
        data.transaction_type || 'vanzare', data.property_type || 'apartament', data.city || '', data.zone || '',
        data.surface_useable || null, data.surface_total || null, data.surface_land || null,
        data.rooms || null, data.bedrooms || null, data.bathrooms || null, data.floor || '', data.building_floors || null, data.building_construction_year || null,
        data.partitioning || '', data.comfort || '', tags, data.video_link || '', data.virtual_tour_link || '',
        id
      ]
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
