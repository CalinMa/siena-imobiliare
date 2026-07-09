import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    // 1. Fetch settings to get the Place ID
    const [rows]: any = await db.query('SELECT * FROM settings WHERE setting_key = "google_place_id"');
    const placeIdRow = rows[0];
    
    // Default place ID for Siena Imobiliare if not set in DB
    const placeId = placeIdRow && placeIdRow.setting_value ? placeIdRow.setting_value : 'ChIJbyZfK66vtKsRGQ086pQASl4';
    
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${process.env.GOOGLE_PLACES_API_KEY}&language=ro`;
    
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    
    if (data.status === 'OK' && data.result) {
      return NextResponse.json(data.result);
    } else {
      return NextResponse.json({ error: 'Failed to fetch reviews', details: data }, { status: 400 });
    }
  } catch (err) {
    console.error('REVIEWS API ERROR:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
