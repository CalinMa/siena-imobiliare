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
      "ALTER TABLE properties ADD COLUMN currency VARCHAR(10) DEFAULT 'EUR'"
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
