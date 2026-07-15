import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { syncPropertyToImografic } from '@/lib/imograficSync';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

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
          title = ?, description = ?, price = ?, currency = ?, status = ?, images = ?,
          transaction_type = ?, property_type = ?, county = ?, city = ?, zone = ?, address = ?,
          surface_useable = ?, surface_total = ?, surface_land = ?,
          rooms = ?, bedrooms = ?, bathrooms = ?, floor = ?, building_floors = ?, building_construction_year = ?,
          partitioning = ?, comfort = ?, tags = ?, video_link = ?, virtual_tour_link = ?, transacted_by_us = ?
         WHERE id = ?`,
        [
          data.title, data.description || '', data.price || 0, data.currency || 'EUR', data.status, images,
          data.transaction_type || 'vanzare', data.property_type || 'apartament', data.county || '', data.city || '', data.zone || '', data.address || '',
          data.surface_useable || null, data.surface_total || null, data.surface_land || null,
          data.rooms || null, data.bedrooms || null, data.bathrooms || null, data.floor || '', data.building_floors || null, data.building_construction_year || null,
          data.partitioning || '', data.comfort || '', tags, data.video_link || '', data.virtual_tour_link || '', data.transacted_by_us || false,
          id
        ]
      );
      
      // Sincronizare cu Imografic
      syncPropertyToImografic(id).catch(err => console.error("Sync error:", err));
      
    revalidatePath('/', 'layout');
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
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
