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
    const alters = [
      "ALTER TABLE properties ADD COLUMN transaction_type ENUM('vanzare', 'inchiriere') DEFAULT 'vanzare'",
      "ALTER TABLE properties ADD COLUMN property_type ENUM('apartament', 'casa', 'teren', 'comercial', 'birouri', 'industrial') DEFAULT 'apartament'",
      "ALTER TABLE properties ADD COLUMN city VARCHAR(255)",
      "ALTER TABLE properties ADD COLUMN zone VARCHAR(255)",
      "ALTER TABLE properties ADD COLUMN surface_useable DECIMAL(10,2)",
      "ALTER TABLE properties ADD COLUMN surface_total DECIMAL(10,2)",
      "ALTER TABLE properties ADD COLUMN surface_land DECIMAL(10,2)",
      "ALTER TABLE properties ADD COLUMN rooms INT",
      "ALTER TABLE properties ADD COLUMN bedrooms INT",
      "ALTER TABLE properties ADD COLUMN bathrooms INT",
      "ALTER TABLE properties ADD COLUMN floor VARCHAR(50)",
      "ALTER TABLE properties ADD COLUMN building_floors INT",
      "ALTER TABLE properties ADD COLUMN building_construction_year INT",
      "ALTER TABLE properties ADD COLUMN partitioning VARCHAR(100)",
      "ALTER TABLE properties ADD COLUMN comfort VARCHAR(50)",
      "ALTER TABLE properties ADD COLUMN tags JSON",
      "ALTER TABLE properties ADD COLUMN video_link VARCHAR(500)",
      "ALTER TABLE properties ADD COLUMN virtual_tour_link VARCHAR(500)"
    ];

    for (let sql of alters) {
      try {
        await c.query(sql);
        console.log("Success:", sql);
      } catch(err) {
        if(err.code === 'ER_DUP_FIELDNAME') {
          console.log("Already exists:", sql);
        } else {
          console.error("Error:", sql, err.message);
        }
      }
    }

    console.log("Upgrade finished.");
  } catch(e) {
    console.error(e);
  } finally {
    c.end();
  }
}

upgrade();
