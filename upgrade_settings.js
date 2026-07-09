require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function upgrade() {
  const c = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await c.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value TEXT
      )
    `);

    console.log("Settings table created.");

    // Insert defaults if not exist
    const defaults = [
      ['agency_description', 'Agenția Siena - Experți în imobiliare. Găsește casa visurilor tale sau vinde rapid o proprietate. Portofoliu de anunțuri verificate și servicii premium.'],
      ['hero_image', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000'],
      ['mix_portfolio', 'false'],
      ['contact_phone', '0700000000'],
      ['contact_whatsapp', '0700000000'],
      ['contact_email', 'contact@sienaimobiliare.ro'],
      ['social_facebook', 'https://www.facebook.com/sienaimobiliare'],
      ['social_instagram', ''],
      ['social_tiktok', '']
    ];

    for (const [key, val] of defaults) {
      await c.query('INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, val]);
    }
    console.log("Defaults inserted.");
  } catch (err) {
    console.error(err);
  } finally {
    await c.end();
  }
}

upgrade();
