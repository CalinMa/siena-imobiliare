import db from './db';

const IMOGRAFIC_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://imografic.ro';

function safeParseJson(val: string) {
  try { return JSON.parse(val); } catch (e) { return null; }
}

export async function syncPropertyToImografic(propertyId: number | string) {
  try {
    // 1. Get the API Key from settings
    const [settingRows]: any = await db.query(
      'SELECT setting_value FROM settings WHERE setting_key = "imografic_api_key"'
    );
    const apiKey = settingRows[0]?.setting_value;

    if (!apiKey) {
      console.log('[ImograficSync] No API Key set. Skipping sync.');
      return;
    }

    // 2. Fetch the full property data
    const [propRows]: any = await db.query(
      'SELECT * FROM properties WHERE id = ?',
      [propertyId]
    );

    if (propRows.length === 0) {
      console.log(`[ImograficSync] Property ${propertyId} not found.`);
      return;
    }

    const property = propRows[0];

    // 3. Prepare payload mapping Siena columns exactly to what Webhook expects
    const payload = {
      external_id: property.id,
      slug: property.slug,
      title: property.title,
      description: property.description,
      price: property.price,
      currency: property.currency,
      transaction_type: property.transaction_type, // "Vânzare" / "Închiriere"
      property_type: property.property_type,       // "Apartament", "Casă", etc.
      
      county: property.county,
      city: property.city,
      zone: property.zone,
      address: property.address,
      
      surface_useable: property.surface_useable,
      surface_total: property.surface_total,
      surface_land: property.surface_land,
      
      rooms: property.rooms,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      floor: property.floor,
      building_floors: property.building_floors,
      
      building_construction_year: property.building_construction_year,
      partitioning: property.partitioning,
      comfort: property.comfort,
      
      status: property.status,
      
      images: typeof property.images === 'string' ? (safeParseJson(property.images) || []) : (property.images || []),
      tags: typeof property.tags === 'string' ? (safeParseJson(property.tags) || []) : (property.tags || [])
    };

    // 4. Send request
    const response = await fetch(`${IMOGRAFIC_URL}/ro/api/agency-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`[ImograficSync] Failed to sync property ${property.id}. HTTP ${response.status}:`, errBody);
    } else {
      console.log(`[ImograficSync] Successfully synced property ${property.id} to Imografic.`);
    }
  } catch (error) {
    console.error('[ImograficSync] Error during sync:', error);
  }
}

export async function deletePropertyFromImografic(propertyId: number | string) {
  try {
    const [settingRows]: any = await db.query(
      'SELECT setting_value FROM settings WHERE setting_key = "imografic_api_key"'
    );
    const apiKey = settingRows[0]?.setting_value;

    if (!apiKey) {
      console.log('[ImograficSync] No API Key set. Skipping delete sync.');
      return;
    }

    const response = await fetch(`${IMOGRAFIC_URL}/ro/api/agency-sync?external_id=${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`[ImograficSync] Failed to delete property ${propertyId}. HTTP ${response.status}:`, errBody);
    } else {
      console.log(`[ImograficSync] Successfully deleted property ${propertyId} from Imografic.`);
    }
  } catch (error) {
    console.error('[ImograficSync] Error during delete sync:', error);
  }
}
