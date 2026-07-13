require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function checkDomains() {
  const c = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: { rejectUnauthorized: false }
  });

  const [rows] = await c.query('SELECT images FROM properties WHERE images IS NOT NULL');
  
  const domains = new Set();
  rows.forEach(row => {
    try {
      const imgs = JSON.parse(row.images);
      imgs.forEach(img => {
        try {
          const url = new URL(img);
          domains.add(url.hostname);
        } catch(e) {}
      });
    } catch(e) {}
  });

  console.log('Unique image domains:', Array.from(domains));
  c.end();
}
checkDomains();
